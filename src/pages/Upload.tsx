import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import FileUpload from "@/components/FileUpload";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { ResumeAnalysis } from "@/lib/types";

const Upload = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [resumeText, setResumeText] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const extractText = async (file: File): Promise<string> => {
    // For PDF/DOCX we read as text. For real extraction we use the edge function.
    const formData = new FormData();
    formData.append("file", file);
    
    // Simple text extraction from file
    const text = await file.text();
    return text;
  };

  const handleFileSelect = async (file: File) => {
    setIsAnalyzing(true);
    try {
      const text = await extractText(file);
      setResumeText(text);

      const { data, error } = await supabase.functions.invoke("analyze-resume", {
        body: { resumeText: text, jobDescription },
      });

      if (error) throw error;

      const analysis = data as ResumeAnalysis;
      
      // Store in localStorage for dashboard
      localStorage.setItem("latestAnalysis", JSON.stringify(analysis));
      localStorage.setItem("resumeText", text);
      if (jobDescription) localStorage.setItem("jobDescription", jobDescription);

      toast({ title: "Analysis complete!", description: `ATS Score: ${analysis.ats_score}/100` });
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Analysis error:", err);
      toast({ title: "Analysis failed", description: err.message || "Please try again.", variant: "destructive" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center space-y-3">
              <h1 className="font-heading text-3xl md:text-4xl font-bold">
                Upload Your <span className="text-gradient">Resume</span>
              </h1>
              <p className="text-muted-foreground">
                Upload your resume and optionally paste a job description for matching.
              </p>
            </div>

            <FileUpload onFileSelect={handleFileSelect} isLoading={isAnalyzing} />

            <div className="glass-card p-6 space-y-4">
              <h3 className="font-heading font-semibold text-foreground">
                Job Description <span className="text-muted-foreground font-normal text-sm">(optional)</span>
              </h3>
              <Textarea
                placeholder="Paste the job description here to get a match analysis..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="min-h-[150px] bg-muted/30 border-border/50 resize-none"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
