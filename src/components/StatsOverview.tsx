import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Gift, Sparkles } from "lucide-react";

interface StatsOverviewProps {
  userId: string;
}

export default function StatsOverview({ userId }: StatsOverviewProps) {
  const [stats, setStats] = useState({
    points: 0,
    referrals: 0,
    rank: "Bronze",
  });

  useEffect(() => {
    fetchStats();
  }, [userId]);

  const fetchStats = async () => {
    try {
      const { data: rewardsData } = await supabase
        .from("rewards")
        .select("points")
        .eq("user_id", userId)
        .single();

      const { count: referralCount } = await supabase
        .from("affiliates")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

      const points = rewardsData?.points || 0;
      const rank = points >= 1000 ? "Gold" : points >= 500 ? "Silver" : "Bronze";

      setStats({
        points,
        referrals: referralCount || 0,
        rank,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-card border-border/50 hover:shadow-glow transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Points</CardTitle>
          <Gift className="w-4 h-4 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-accent">{stats.points}</div>
          <p className="text-xs text-muted-foreground mt-1">Lifetime rewards earned</p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border/50 hover:shadow-purple transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Referrals</CardTitle>
          <Users className="w-4 h-4 text-info" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-info">{stats.referrals}</div>
          <p className="text-xs text-muted-foreground mt-1">Active referral links</p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border/50 hover:shadow-gold transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Rank</CardTitle>
          <Sparkles className="w-4 h-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary">{stats.rank}</div>
          <p className="text-xs text-muted-foreground mt-1">Current achievement tier</p>
        </CardContent>
      </Card>
    </div>
  );
}
