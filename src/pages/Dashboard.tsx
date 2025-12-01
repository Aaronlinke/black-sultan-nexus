import { Crown, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import RewardPanel from "@/components/RewardPanel";
import AffiliatePanel from "@/components/AffiliatePanel";
import AIChat from "@/components/AIChat";
import StatsOverview from "@/components/StatsOverview";

export default function Dashboard() {
  const userId = "demo-user"; // Demo mode - no login required

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.href = '/auth'}
            className="border-border"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Login
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-gold rounded-xl p-8 shadow-gold">
          <h2 className="text-3xl font-bold text-primary-foreground mb-2">
            Willkommen im Black Sultan Empire!
          </h2>
          <p className="text-primary-foreground/80">
            Dein Premium Affiliate & Reward System
          </p>
        </div>

        {/* Stats Overview */}
        <StatsOverview userId={userId} />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RewardPanel userId={userId} />
          <AffiliatePanel userId={userId} />
        </div>

        {/* AI Assistant */}
        <AIChat />
      </main>
    </div>
  );
}
