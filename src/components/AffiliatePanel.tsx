import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Users, Copy, Link2, Check } from "lucide-react";

interface AffiliatePanelProps {
  userId: string;
  onNewReferral: () => void;
}

function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "BSE-";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export default function AffiliatePanel({ userId, onNewReferral }: AffiliatePanelProps) {
  const [referrals, setReferrals] = useState<{ id: string; code: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const generateReferralCode = () => {
    setLoading(true);
    setTimeout(() => {
      const newCode = generateCode();
      setReferrals((prev) => [...prev, { id: crypto.randomUUID(), code: newCode }]);
      onNewReferral();
      toast.success(`Code ${newCode} generiert! 🔗`);
      setLoading(false);
    }, 400);
  };

  const copyToClipboard = (id: string, code: string) => {
    const referralUrl = `${window.location.origin}/ref/${code}`;
    navigator.clipboard.writeText(referralUrl);
    setCopiedId(id);
    toast.success("Referral-Link kopiert!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <Card className="bg-card border-border/50 shadow-lg hover:shadow-purple transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-info/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-info" />
            </div>
            <div>
              <CardTitle className="text-foreground">Affiliate Program</CardTitle>
              <CardDescription>Teile & verdiene Rewards</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-gradient-dark rounded-lg p-6 border border-info/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-medium text-foreground mb-1">Active Referrals</h4>
              <div className="text-3xl font-bold text-info">{referrals.length}</div>
            </div>
            <Link2 className="w-8 h-8 text-info opacity-50" />
          </div>
          <Button onClick={generateReferralCode} disabled={loading} className="w-full bg-info hover:bg-info/90 text-info-foreground">
            {loading ? "Generating..." : "Generate New Code"}
          </Button>
        </div>

        {referrals.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Your Referral Links</h4>
            {referrals.map((ref) => (
              <div key={ref.id} className="flex items-center gap-2 p-3 bg-muted rounded-lg border border-border animate-fade-in">
                <div className="flex-1 font-mono text-sm text-foreground">{ref.code}</div>
                <Button size="sm" variant="outline" onClick={() => copyToClipboard(ref.id, ref.code)} className="border-info/50 hover:bg-info/20">
                  {copiedId === ref.id ? <Check className="w-4 h-4 text-info" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-medium text-foreground mb-3">Rewards per Referral</h4>
          <div className="flex items-center justify-between p-3 rounded-lg bg-info/10 border border-info/20">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-info" />
              <span className="text-sm font-medium text-foreground">Each Signup</span>
            </div>
            <span className="text-lg font-bold text-info">+100 pts</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
