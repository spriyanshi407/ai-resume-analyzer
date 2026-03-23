import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Loader2, Bot } from "lucide-react";
import Navbar from "@/components/Navbar";
import ChatMessage from "@/components/ChatMessage";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { ChatMsg } from "@/lib/types";

const SUGGESTIONS = [
  "How do I improve my resume for tech roles?",
  "What are common interview mistakes?",
  "Help me write a cover letter",
  "What skills are in demand for 2026?",
];

const Chatbot = () => {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || isLoading) return;
    setInput("");

    const userMsg: ChatMsg = { role: "user", content: msg };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("career-chat", {
        body: { messages: newMessages },
      });
      if (error) throw error;
      setMessages([...newMessages, { role: "assistant", content: data.response }]);
    } catch (err: any) {
      console.error("Chat error:", err);
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 pt-16 flex flex-col">
        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6">
          <div className="container mx-auto max-w-3xl space-y-4">
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20 space-y-6"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto animate-float">
                  <Bot className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h2 className="font-heading text-2xl font-bold">AI Career Coach</h2>
                  <p className="text-muted-foreground mt-2">
                    Ask me anything about resumes, interviews, or career advice.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="glass-card px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {messages.map((msg, i) => (
              <ChatMessage key={i} role={msg.role} content={msg.content} />
            ))}

            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="glass-card px-4 py-3">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-border/30 bg-background/80 backdrop-blur-xl px-4 py-4">
          <div className="container mx-auto max-w-3xl">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex gap-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me about your career..."
                className="flex-1 bg-muted/30 border border-border/50 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                disabled={isLoading}
              />
              <Button type="submit" disabled={!input.trim() || isLoading} size="icon" className="rounded-xl h-12 w-12">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
