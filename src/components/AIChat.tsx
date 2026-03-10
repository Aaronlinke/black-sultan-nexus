import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Sparkles, Send, Bot, User } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const quickActions = [
  { label: "📈 Strategie-Tipps", prompt: "Gib mir 3 konkrete Strategien um meine Affiliate-Einnahmen zu maximieren" },
  { label: "🎯 Punkte optimieren", prompt: "Wie kann ich am schnellsten den Gold-Rang erreichen?" },
  { label: "🔥 Growth Hacks", prompt: "Was sind die besten Growth-Hacking Methoden für mein Affiliate Business?" },
];

export default function AIChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: "user", content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("ai-assistant", {
        body: { prompt: text },
      });

      if (error) throw error;
      setMessages([...newMessages, { role: "assistant", content: data.response }]);
    } catch (error: any) {
      toast.error("AI antwortet gerade nicht");
      setMessages([...newMessages, { role: "assistant", content: "⚠️ Verbindung fehlgeschlagen. Bitte versuche es erneut." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <Card className="bg-card border-border/50 shadow-lg hover:shadow-purple transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-purple flex items-center justify-center shadow-purple">
            <Sparkles className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-foreground">AI Assistant</CardTitle>
            <CardDescription>Dein strategischer Berater</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action) => (
            <Button
              key={action.label}
              size="sm"
              variant="outline"
              onClick={() => sendMessage(action.prompt)}
              disabled={loading}
              className="text-xs border-secondary/30 hover:bg-secondary/20 text-muted-foreground hover:text-foreground"
            >
              {action.label}
            </Button>
          ))}
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="h-[300px] overflow-y-auto space-y-3 pr-2">
          {messages.length === 0 && !loading && (
            <div className="text-center py-12">
              <Sparkles className="w-10 h-10 mx-auto mb-3 text-secondary/50" />
              <p className="text-sm font-medium text-foreground mb-2">Black Sultan AI aktiv</p>
              <p className="text-xs text-muted-foreground">Frag nach Strategien, Optimierung oder Business-Insights</p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-2 animate-fade-in ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-secondary" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                msg.role === "user"
                  ? "bg-primary/20 text-foreground border border-primary/30"
                  : "bg-muted text-foreground border border-border"
              }`}>
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>
              {msg.role === "user" && (
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-4 h-4 text-primary" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-2 items-start animate-fade-in">
              <div className="w-7 h-7 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-secondary" />
              </div>
              <div className="bg-muted rounded-lg px-4 py-3 border border-border">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-secondary/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-secondary/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-secondary/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nachricht eingeben..."
            className="bg-muted border-border"
            disabled={loading}
          />
          <Button type="submit" disabled={loading || !input.trim()} size="icon" className="bg-gradient-purple hover:opacity-90 text-primary-foreground">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
