import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

const ChatMessage = ({ role, content }: ChatMessageProps) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`flex gap-3 ${role === "user" ? "flex-row-reverse" : ""}`}
  >
    <div
      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
        role === "assistant" ? "bg-primary/15 text-primary" : "bg-secondary/15 text-secondary"
      }`}
    >
      {role === "assistant" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
    </div>
    <div
      className={`max-w-[80%] rounded-xl px-4 py-3 text-sm ${
        role === "user"
          ? "bg-primary/10 border border-primary/20 text-foreground"
          : "glass-card text-foreground"
      }`}
    >
      <div className="prose prose-sm prose-invert max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  </motion.div>
);

export default ChatMessage;
