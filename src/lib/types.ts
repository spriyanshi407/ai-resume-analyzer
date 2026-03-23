export interface ResumeAnalysis {
  id?: string;
  ats_score: number;
  strengths: string[];
  weaknesses: string[];
  missing_keywords: string[];
  suggestions: string[];
  section_scores: {
    experience: number;
    education: number;
    skills: number;
    formatting: number;
    keywords: number;
  };
  resume_text: string;
  created_at?: string;
}

export interface JobMatch {
  match_percentage: number;
  matching_skills: string[];
  missing_skills: string[];
  recommendations: string[];
}

export interface ChatMsg {
  role: "user" | "assistant";
  content: string;
}
