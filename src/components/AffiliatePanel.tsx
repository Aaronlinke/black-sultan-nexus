import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Users, Copy, Link2, Check } from "lucide-react";

interface AffiliatePanelProps {
  userId: string;
}

export default function AffiliatePanel({ userId }: AffiliatePanelProps) {
  const [referralCode, setReferralCode] = useState("");
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchReferrals();
  }, [userId]);

  const fetchReferrals = async () => {
    try {
      const { data, error } = await supabase
        .from("affiliates")
        .select("*")
        .eq("user_id", userId);

      if (error) throw error;
      setReferrals(data || []);
    } catch (error: any) {
      console.error("Error fetching referrals:", error);
    }
  };

  const generateReferralCode = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc("generate_referral_code");
      if (error) throw error;

      const newCode = data;
      const { error: insertError } = await supabase
        .from("affiliates")
        .insert({ user_id: userId, referral_code: newCode });

      if (insertError) throw insertError;

      toast.success("Referral code generated!");
      fetchReferrals();
    } catch (error: any) {
      toast.error("Failed to generate code");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (code: string) => {
    const referralUrl = `${window.location.origin}/ref/${code}`;
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    toast.success("Referral link copied!");
    setTimeout(() => setCopied(false), 2000);
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
              <CardDescription>Share and earn rewards</CardDescription>
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
          <Button
            onClick={generateReferralCode}
            disabled={loading}
            className="w-full bg-info hover:bg-info/90 text-info-foreground"
          >
            Generate New Code
          </Button>
        </div>

        {referrals.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Your Referral Links</h4>
            {referrals.map((ref) => (
              <div
                key={ref.id}
                className="flex items-center gap-2 p-3 bg-muted rounded-lg border border-border"
              >
                <div className="flex-1 font-mono text-sm text-foreground">
                  {ref.referral_code}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(ref.referral_code)}
                  className="border-info/50 hover:bg-info/20"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-info" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-medium text-foreground mb-3">Rewards per Referral</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-lg bg-info/10 border border-info/20">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-info" />
                <span className="text-sm font-medium text-foreground">Each Signup</span>
              </div>
              <span className="text-lg font-bold text-info">+100 pts</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Referrals are tracked automatically when users sign up using your link
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
