import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Gift, Plus, TrendingUp, Zap } from "lucide-react";

interface RewardPanelProps {
  userId: string;
  points: number;
  onAddPoints: (amount: number) => void;
}

export default function RewardPanel({ userId, points, onAddPoints }: RewardPanelProps) {
  const [loading, setLoading] = useState(false);

  const rank = points >= 1000 ? "Gold" : points >= 500 ? "Silver" : "Bronze";
  const rankProgress = points >= 1000 ? 100 : points >= 500 ? ((points - 500) / 500) * 100 : (points / 500) * 100;

  const addPoints = (amount: number) => {
    setLoading(true);
    setTimeout(() => {
      onAddPoints(amount);
      toast.success(`+${amount} Points! 🎉`);
      setLoading(false);
    }, 300);
  };

  return (
    <Card className="bg-card border-border/50 shadow-lg hover:shadow-glow transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
              <Gift className="w-6 h-6 text-accent" />
            </div>
            <div>
              <CardTitle className="text-foreground">Rewards Center</CardTitle>
              <CardDescription>Punkte sammeln & Rang aufsteigen</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-gradient-dark rounded-lg p-6 border border-accent/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Current Balance</span>
            <TrendingUp className="w-4 h-4 text-accent" />
          </div>
          <div className="text-4xl font-bold text-accent">{points}</div>
          <p className="text-xs text-muted-foreground mt-1">Points</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{rank}</span>
            <span>{rank === "Gold" ? "MAX" : rank === "Silver" ? "Gold" : "Silver"}</span>
          </div>
          <Progress value={rankProgress} className="h-3 bg-muted" />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Button onClick={() => addPoints(10)} disabled={loading} size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Plus className="w-3 h-3 mr-1" />+10
          </Button>
          <Button onClick={() => addPoints(50)} disabled={loading} size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Plus className="w-3 h-3 mr-1" />+50
          </Button>
          <Button onClick={() => addPoints(100)} disabled={loading} size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Zap className="w-3 h-3 mr-1" />+100
          </Button>
        </div>

        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-medium text-foreground mb-3">Rank Progression</h4>
          <div className="space-y-2 text-sm">
            <div className={`flex items-center justify-between p-2 rounded ${rank === "Bronze" ? "bg-accent/20 border border-accent/30" : "bg-muted/50"}`}>
              <span className={rank === "Bronze" ? "text-accent font-medium" : "text-muted-foreground"}>🥉 Bronze</span>
              <span className="text-foreground font-medium">0 - 499</span>
            </div>
            <div className={`flex items-center justify-between p-2 rounded ${rank === "Silver" ? "bg-info/20 border border-info/30" : "bg-muted/50"}`}>
              <span className={rank === "Silver" ? "text-info font-medium" : "text-muted-foreground"}>🥈 Silver</span>
              <span className="text-foreground font-medium">500 - 999</span>
            </div>
            <div className={`flex items-center justify-between p-2 rounded ${rank === "Gold" ? "bg-primary/20 border border-primary/30" : "bg-muted/50"}`}>
              <span className={rank === "Gold" ? "text-primary font-medium" : "text-muted-foreground"}>🥇 Gold</span>
              <span className="text-foreground font-medium">1000+</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
