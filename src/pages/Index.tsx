import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FileText, BarChart3, MessageSquare, Sparkles, ArrowRight, Zap, Shield, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

const features = [
  {
    icon: FileText,
    title: "Smart Resume Parsing",
    description: "Upload PDF or DOCX files and get instant text extraction with AI-powered analysis.",
  },
  {
    icon: BarChart3,
    title: "ATS Score Analysis",
    description: "Get a detailed ATS compatibility score with actionable insights to improve your resume.",
  },
  {
    icon: Target,
    title: "Job Description Matching",
    description: "Compare your resume against any job description to find gaps and boost your match rate.",
  },
  {
    icon: MessageSquare,
    title: "AI Career Coach",
    description: "Chat with an AI career advisor for personalized resume tips and interview prep.",
  },
];

const stats = [
  { value: "95%", label: "ATS Accuracy" },
  { value: "10K+", label: "Resumes Analyzed" },
  { value: "4.9★", label: "User Rating" },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    {/* Hero */}
    <section className="relative pt-32 pb-20 px-4 overflow-hidden">
      <div className="bg-gradient-hero absolute inset-0 pointer-events-none" />
      <div className="container mx-auto max-w-5xl relative">
        <motion.div
          className="text-center space-y-6"
          initial="initial"
          animate="animate"
          transition={{ staggerChildren: 0.15 }}
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 glass-card px-4 py-2 text-sm text-primary">
            <Sparkles className="w-4 h-4" />
            Powered by Advanced AI
          </motion.div>

          <motion.h1 variants={fadeUp} className="font-heading text-5xl md:text-7xl font-bold leading-tight">
            Your Resume,{" "}
            <span className="text-gradient">Supercharged</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Get instant ATS scores, AI-powered feedback, job matching, and career coaching — all in one platform.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/upload">
              <Button size="lg" className="gap-2 text-base px-8 glow-border">
                Analyze My Resume <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/chatbot">
              <Button variant="outline" size="lg" className="gap-2 text-base px-8">
                <MessageSquare className="w-4 h-4" /> Talk to AI Coach
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div variants={fadeUp} className="flex justify-center gap-12 pt-12">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-heading font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>

    {/* Features */}
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold">Everything You Need</h2>
          <p className="text-muted-foreground mt-3">Comprehensive tools to land your dream job.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 hover:border-primary/30 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:glow-border transition-all">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* How it works */}
    <section className="py-20 px-4 border-t border-border/30">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold">How It Works</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Zap, step: "01", title: "Upload", desc: "Drop your resume in PDF or DOCX format." },
            { icon: BarChart3, step: "02", title: "Analyze", desc: "AI scans and scores your resume instantly." },
            { icon: Shield, step: "03", title: "Improve", desc: "Get actionable feedback and boost your ATS score." },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center space-y-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                <item.icon className="w-7 h-7 text-primary" />
              </div>
              <span className="text-xs font-mono text-primary/60">STEP {item.step}</span>
              <h3 className="font-heading font-semibold text-lg">{item.title}</h3>
              <p className="text-muted-foreground text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card p-12 text-center glow-border"
        >
          <h2 className="font-heading text-3xl font-bold mb-4">Ready to Stand Out?</h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of professionals who've improved their resumes with AI.
          </p>
          <Link to="/upload">
            <Button size="lg" className="gap-2 px-8">
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>

    {/* Footer */}
    <footer className="border-t border-border/30 py-8 px-4">
      <div className="container mx-auto text-center text-sm text-muted-foreground">
        © 2026 CVVibe 🔥. Built with AI-powered intelligence.. Built with AI-powered intelligence.
      </div>
    </footer>
  </div>
);

export default Index;
