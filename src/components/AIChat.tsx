import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Sparkles, Send } from "lucide-react";

export default function AIChat() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setResponse("");

    try {
      const { data, error } = await supabase.functions.invoke("ai-assistant", {
        body: { prompt },
      });

      if (error) throw error;
      setResponse(data.response);
    } catch (error: any) {
      toast.error("Failed to get AI response");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-card border-border/50 shadow-lg hover:shadow-purple transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-purple flex items-center justify-center shadow-purple">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-foreground">AI Assistant</CardTitle>
            <CardDescription>Powered by Lovable AI - Your strategic advisor</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask about rewards optimization, affiliate strategies, or market insights..."
              className="min-h-[120px] bg-muted border-border resize-none"
              disabled={loading}
            />
          </div>
          <Button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="w-full bg-gradient-purple hover:opacity-90 shadow-purple text-white"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Thinking...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </>
            )}
          </Button>
        </form>

        {response && (
          <div className="mt-6 p-4 bg-gradient-dark rounded-lg border border-secondary/20">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-secondary flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-secondary mb-2">AI Response</h4>
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                  {response}
                </p>
              </div>
            </div>
          </div>
        )}

        {!response && !loading && (
          <div className="text-center py-8">
            <Sparkles className="w-10 h-10 mx-auto mb-3 text-secondary/50" />
            <p className="text-sm font-medium text-foreground mb-2">Elite AI Assistant Active</p>
            <p className="text-xs text-muted-foreground">
              Ask about growth strategies, reward optimization, or business insights
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
