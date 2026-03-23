import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, AlertTriangle, Lightbulb, Target, Download, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import ScoreRing from "@/components/ScoreRing";
import ProgressBar from "@/components/ProgressBar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { ResumeAnalysis, JobMatch } from "@/lib/types";

const sectionVariant = (v: number) => {
  if (v >= 80) return "success" as const;
  if (v >= 60) return "warning" as const;
  return "destructive" as const;
};

const Dashboard = () => {
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [jobMatch, setJobMatch] = useState<JobMatch | null>(null);
  const [jobDesc, setJobDesc] = useState("");
  const [matching, setMatching] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const stored = localStorage.getItem("latestAnalysis");
    if (stored) setAnalysis(JSON.parse(stored));
    const storedJD = localStorage.getItem("jobDescription");
    if (storedJD) setJobDesc(storedJD);
  }, []);

  const handleMatch = async () => {
    if (!jobDesc.trim() || !analysis) return;
    setMatching(true);
    try {
      const resumeText = localStorage.getItem("resumeText") || analysis.resume_text;
      const { data, error } = await supabase.functions.invoke("match-job", {
        body: { resumeText, jobDescription: jobDesc },
      });
      if (error) throw error;
      setJobMatch(data as JobMatch);
    } catch (err: any) {
      toast({ title: "Matching failed", description: err.message, variant: "destructive" });
    } finally {
      setMatching(false);
    }
  };

  if (!analysis) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 px-4">
          <div className="container mx-auto max-w-3xl text-center py-20">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="font-heading text-2xl font-bold">No Analysis Yet</h2>
              <p className="text-muted-foreground">
                Upload a resume first to see your analysis dashboard.
              </p>
              <a href="/upload">
                <Button className="mt-4">Upload Resume</Button>
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-5xl space-y-8">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="font-heading text-3xl font-bold">Analysis <span className="text-gradient">Dashboard</span></h1>
              <p className="text-muted-foreground text-sm mt-1">
                {analysis.created_at ? new Date(analysis.created_at).toLocaleDateString() : "Just now"}
              </p>
            </div>
            <Button variant="outline" className="gap-2" onClick={() => {
              toast({ title: "Coming soon", description: "PDF download will be available shortly." });
            }}>
              <Download className="w-4 h-4" /> Download Report
            </Button>
          </motion.div>

          {/* Score + Sections */}
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-8 flex items-center justify-center"
            >
              <ScoreRing score={analysis.ats_score} size={180} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6 md:col-span-2 space-y-5"
            >
              <h3 className="font-heading font-semibold text-lg">Section Scores</h3>
              <ProgressBar label="Experience" value={analysis.section_scores.experience} variant={sectionVariant(analysis.section_scores.experience)} />
              <ProgressBar label="Education" value={analysis.section_scores.education} variant={sectionVariant(analysis.section_scores.education)} />
              <ProgressBar label="Skills" value={analysis.section_scores.skills} variant={sectionVariant(analysis.section_scores.skills)} />
              <ProgressBar label="Formatting" value={analysis.section_scores.formatting} variant={sectionVariant(analysis.section_scores.formatting)} />
              <ProgressBar label="Keywords" value={analysis.section_scores.keywords} variant={sectionVariant(analysis.section_scores.keywords)} />
            </motion.div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6 space-y-4">
              <h3 className="font-heading font-semibold text-lg flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" /> Strengths
              </h3>
              <ul className="space-y-3">
                {analysis.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    <span className="text-foreground">{s}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card p-6 space-y-4">
              <h3 className="font-heading font-semibold text-lg flex items-center gap-2">
                <XCircle className="w-5 h-5 text-destructive" /> Weaknesses
              </h3>
              <ul className="space-y-3">
                {analysis.weaknesses.map((w, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <XCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                    <span className="text-foreground">{w}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Missing Keywords */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6 space-y-4">
            <h3 className="font-heading font-semibold text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" /> Missing Keywords
            </h3>
            <div className="flex flex-wrap gap-2">
              {analysis.missing_keywords.map((k, i) => (
                <span key={i} className="px-3 py-1 rounded-full text-sm bg-warning/10 text-warning border border-warning/20">
                  {k}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Suggestions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="glass-card p-6 space-y-4">
            <h3 className="font-heading font-semibold text-lg flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" /> Suggestions
            </h3>
            <ul className="space-y-3">
              {analysis.suggestions.map((s, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <Lightbulb className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span className="text-foreground">{s}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Job Match */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6 space-y-4">
            <h3 className="font-heading font-semibold text-lg flex items-center gap-2">
              <Target className="w-5 h-5 text-secondary" /> Job Description Matching
            </h3>
            <Textarea
              placeholder="Paste a job description to compare..."
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              className="min-h-[100px] bg-muted/30 border-border/50"
            />
            <Button onClick={handleMatch} disabled={matching || !jobDesc.trim()} className="gap-2">
              {matching ? "Matching..." : "Compare"}
            </Button>

            {jobMatch && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 space-y-6">
                <div className="flex items-center gap-6">
                  <ScoreRing score={jobMatch.match_percentage} size={120} label="Match %" />
                  <div className="space-y-2 flex-1">
                    <ProgressBar label="Job Match" value={jobMatch.match_percentage} variant={sectionVariant(jobMatch.match_percentage)} />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-success flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Matching Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {jobMatch.matching_skills.map((s, i) => (
                        <span key={i} className="px-2 py-1 rounded-md text-xs bg-success/10 text-success border border-success/20">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-destructive flex items-center gap-2">
                      <XCircle className="w-4 h-4" /> Missing Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {jobMatch.missing_skills.map((s, i) => (
                        <span key={i} className="px-2 py-1 rounded-md text-xs bg-destructive/10 text-destructive border border-destructive/20">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
