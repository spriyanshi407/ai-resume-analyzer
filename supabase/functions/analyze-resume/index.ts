import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { resumeText, jobDescription } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are an expert resume analyzer and ATS specialist. Analyze the given resume text and provide a detailed analysis.

Return a JSON object with exactly this structure:
{
  "ats_score": <number 0-100>,
  "strengths": [<list of 3-5 strengths as strings>],
  "weaknesses": [<list of 3-5 weaknesses as strings>],
  "missing_keywords": [<list of 5-10 commonly expected keywords missing from the resume>],
  "suggestions": [<list of 4-6 specific improvement suggestions>],
  "section_scores": {
    "experience": <number 0-100>,
    "education": <number 0-100>,
    "skills": <number 0-100>,
    "formatting": <number 0-100>,
    "keywords": <number 0-100>
  }
}

Be specific and actionable in your feedback. Consider ATS compatibility, keyword optimization, formatting, and content quality.`;

    let userPrompt = `Analyze this resume:\n\n${resumeText}`;
    if (jobDescription) {
      userPrompt += `\n\nAlso consider this job description for keyword matching:\n${jobDescription}`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: "resume_analysis",
            description: "Return structured resume analysis",
            parameters: {
              type: "object",
              properties: {
                ats_score: { type: "number" },
                strengths: { type: "array", items: { type: "string" } },
                weaknesses: { type: "array", items: { type: "string" } },
                missing_keywords: { type: "array", items: { type: "string" } },
                suggestions: { type: "array", items: { type: "string" } },
                section_scores: {
                  type: "object",
                  properties: {
                    experience: { type: "number" },
                    education: { type: "number" },
                    skills: { type: "number" },
                    formatting: { type: "number" },
                    keywords: { type: "number" },
                  },
                  required: ["experience", "education", "skills", "formatting", "keywords"],
                },
              },
              required: ["ats_score", "strengths", "weaknesses", "missing_keywords", "suggestions", "section_scores"],
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "resume_analysis" } },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again later." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      throw new Error(`AI gateway error: ${response.status} ${errText}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    const analysis = JSON.parse(toolCall.function.arguments);
    analysis.resume_text = resumeText;
    analysis.created_at = new Date().toISOString();

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-resume error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
