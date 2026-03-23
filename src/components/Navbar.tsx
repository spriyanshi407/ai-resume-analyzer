import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, BarChart3, MessageSquare, Home, Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/upload", label: "Upload", icon: FileText },
  { to: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { to: "/chatbot", label: "AI Coach", icon: MessageSquare },
];

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/30 backdrop-blur-2xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center glow-border">
            <FileText className="w-4 h-4 text-primary" />
          </div>
          <span className="font-heading font-bold text-lg text-foreground"><span className="font-heading font-bold text-lg text-foreground">CVVibe 🔥</span></span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="relative px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {active && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-lg"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className={`relative flex items-center gap-2 ${active ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-foreground">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden glass-card border-t border-border/30 p-4 space-y-1"
        >
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
