import { useState, useEffect } from "react";
import { Crown, LogIn, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import RewardPanel from "@/components/RewardPanel";
import AffiliatePanel from "@/components/AffiliatePanel";
import AIChat from "@/components/AIChat";
import StatsOverview from "@/components/StatsOverview";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 6) return "Gute Nacht";
  if (h < 12) return "Guten Morgen";
  if (h < 18) return "Guten Tag";
  return "Guten Abend";
}

export default function Dashboard() {
  const userId = "demo-user";
  const [points, setPoints] = useState(250);
  const [referrals, setReferrals] = useState(0);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const addPoints = (amount: number) => {
    setPoints((prev) => prev + amount);
  };

  const addReferral = () => {
    setReferrals((prev) => prev + 1);
    setPoints((prev) => prev + 100);
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center shadow-glow">
              <Crown className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-gold bg-clip-text text-transparent">
                Black Sultan
              </h1>
              <p className="text-xs text-muted-foreground">Elite Ecosystem</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
              <Activity className="w-3 h-3 text-accent" />
              <span className="text-accent font-medium">ONLINE</span>
              <span className="mx-1">•</span>
              <span className="font-mono">
                {time.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={() => (window.location.href = "/auth")} className="border-border">
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-gold rounded-xl p-8 shadow-gold animate-fade-in">
          <h2 className="text-3xl font-bold text-primary-foreground mb-2">
            {getGreeting()}, Sultan! 👑
          </h2>
          <p className="text-primary-foreground/80">
            Dein Premium Affiliate & Reward System — Demo-Modus aktiv
          </p>
        </div>

        {/* Stats */}
        <StatsOverview userId={userId} points={points} referrals={referrals} />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RewardPanel userId={userId} points={points} onAddPoints={addPoints} />
          <AffiliatePanel userId={userId} onNewReferral={addReferral} />
        </div>

        {/* AI */}
        <AIChat />
      </main>
    </div>
  );
}
