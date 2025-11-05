import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Gift, Plus, TrendingUp } from "lucide-react";

interface RewardPanelProps {
  userId: string;
}

export default function RewardPanel({ userId }: RewardPanelProps) {
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRewards();

    const channel = supabase
      .channel("rewards-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "rewards",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setPoints(payload.new.points);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const fetchRewards = async () => {
    try {
      const { data, error } = await supabase
        .from("rewards")
        .select("points")
        .eq("user_id", userId)
        .single();

      if (error) throw error;
      setPoints(data?.points || 0);
    } catch (error: any) {
      console.error("Error fetching rewards:", error);
    }
  };

  const addPoints = async (amount: number) => {
    setLoading(true);
    try {
      const newPoints = points + amount;
      const { error } = await supabase
        .from("rewards")
        .update({ points: newPoints })
        .eq("user_id", userId);

      if (error) throw error;
      toast.success(`Added ${amount} points!`);
      setPoints(newPoints);
    } catch (error: any) {
      toast.error("Failed to add points");
      console.error(error);
    } finally {
      setLoading(false);
    }
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
              <CardDescription>Manage your points and achievements</CardDescription>
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

        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => addPoints(10)}
            disabled={loading}
            className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-md"
          >
            <Plus className="w-4 h-4 mr-2" />
            +10 Points
          </Button>
          <Button
            onClick={() => addPoints(50)}
            disabled={loading}
            className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-md"
          >
            <Plus className="w-4 h-4 mr-2" />
            +50 Points
          </Button>
        </div>

        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-medium text-foreground mb-3">Rank Progression</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between p-2 rounded bg-muted/50">
              <span className="text-muted-foreground">Bronze</span>
              <span className="text-foreground font-medium">0 - 499 pts</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-muted/50">
              <span className="text-muted-foreground">Silver</span>
              <span className="text-foreground font-medium">500 - 999 pts</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-accent/20">
              <span className="text-accent font-medium">Gold</span>
              <span className="text-accent font-medium">1000+ pts</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
