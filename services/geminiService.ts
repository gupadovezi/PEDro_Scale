
import { GoogleGenAI, Type } from "@google/genai";
import { PEDRO_CRITERIA, TrialAnalysis } from "../types";

const SYSTEM_INSTRUCTION = `
You are a world-class clinical research analyst specializing in evidence-based practice and physiotherapy trial methodology.
Your task is to evaluate a Randomized Controlled Trial (RCT) using the PEDro Scale (Physiotherapy Evidence Database).

Follow these rules for each of the 11 criteria:
1. Points are only awarded when a criterion is CLEARLY satisfied. If there's any ambiguity, do not award the point.
2. For Criterion 1 (Eligibility): Check if the source of subjects and eligibility criteria are described.
3. For Criterion 2 (Randomization): Must state "random" allocation.
4. For Criterion 3 (Concealed allocation): Decision-maker was unaware of group allocation at the time of entry.
5. For Criterion 4 (Baseline): Groups similar at baseline on key prognostic indicators.
6. For Criteria 5-7 (Blinding): Explicitly state if subjects, therapists, or assessors were blinded.
7. For Criterion 8 (Follow-up): >85% of initially allocated subjects measured for at least one key outcome.
8. For Criterion 9 (ITT): Analyzed as allocated or statement that all subjects received treatment as allocated.
9. For Criterion 10 (Comparison): Statistical comparison between groups reported.
10. For Criterion 11 (Point/Variability): Provides mean differences/proportions AND SD/SE/CI/Interquartile ranges.

Input might be text from the paper or images of the paper.
Respond strictly in JSON format matching the schema provided.
`;

export const analyzeTrial = async (input: string | { data: string, mimeType: string }): Promise<TrialAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      results: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            criterionId: { type: Type.INTEGER },
            met: { type: Type.BOOLEAN },
            reasoning: { type: Type.STRING },
            location: { type: Type.STRING, description: "Direct quote or section where this information was found" }
          },
          required: ["criterionId", "met", "reasoning"]
        }
      },
      summary: { type: Type.STRING, description: "A brief overall summary of the study's quality" }
    },
    required: ["results", "summary"]
  };

  const contents = typeof input === 'string' 
    ? { parts: [{ text: `Analyze this trial text based on the PEDro scale: \n\n${input}` }] }
    : { parts: [{ inlineData: input }, { text: "Analyze this trial image based on the PEDro scale." }] };

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: responseSchema,
      temperature: 0.1, // Low temperature for factual analysis
    }
  });

  const rawResult = JSON.parse(response.text);
  
  // Calculate total score based on criteria 2-11
  const scoredResults = rawResult.results.filter((r: any) => {
    const crit = PEDRO_CRITERIA.find(p => p.id === r.criterionId);
    return crit?.isScored && r.met;
  });

  return {
    results: rawResult.results,
    totalScore: scoredResults.length,
    summary: rawResult.summary
  };
};
