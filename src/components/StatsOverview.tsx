import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Users, Gift, Sparkles } from "lucide-react";

interface StatsOverviewProps {
  userId: string;
  points?: number;
  referrals?: number;
}

export default function StatsOverview({ userId, points = 0, referrals = 0 }: StatsOverviewProps) {
  const [animatedPoints, setAnimatedPoints] = useState(0);
  const [animatedReferrals, setAnimatedReferrals] = useState(0);

  const rank = points >= 1000 ? "Gold" : points >= 500 ? "Silver" : "Bronze";
  const rankProgress = points >= 1000 ? 100 : points >= 500 ? ((points - 500) / 500) * 100 : (points / 500) * 100;
  const nextRank = rank === "Gold" ? "MAX" : rank === "Silver" ? "Gold" : "Silver";
  const pointsToNext = rank === "Gold" ? 0 : rank === "Silver" ? 1000 - points : 500 - points;

  useEffect(() => {
    const duration = 800;
    const steps = 30;
    const pointStep = points / steps;
    const refStep = referrals / steps;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setAnimatedPoints(Math.min(Math.round(pointStep * i), points));
      setAnimatedReferrals(Math.min(Math.round(refStep * i), referrals));
      if (i >= steps) clearInterval(interval);
    }, duration / steps);
    return () => clearInterval(interval);
  }, [points, referrals]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-card border-border/50 hover:shadow-glow transition-shadow animate-fade-in">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Points</CardTitle>
          <Gift className="w-4 h-4 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-accent">{animatedPoints}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {rank === "Gold" ? "Elite member 👑" : rank === "Silver" ? "Premium tier ⭐" : "Growing strong 🌱"}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border/50 hover:shadow-purple transition-shadow animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Referrals</CardTitle>
          <Users className="w-4 h-4 text-info" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-info">{animatedReferrals}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {referrals > 0 ? `${referrals * 100} pts earned` : "Generate your first code"}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border/50 hover:shadow-gold transition-shadow animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Rank</CardTitle>
          <Sparkles className="w-4 h-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary">{rank}</div>
          <div className="mt-2">
            <Progress value={rankProgress} className="h-2 bg-muted" />
            <p className="text-xs text-muted-foreground mt-1">
              {rank === "Gold" ? "Maximum tier unlocked 🏆" : `${pointsToNext} pts to ${nextRank}`}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
