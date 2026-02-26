import { GoogleGenAI, Type } from "@google/genai";
import { InterviewQuestion, InterviewReport, InterviewResponse } from "../types";
import { QUESTION_RUBRIC } from "./interviewRubric";

// Helper to convert file to base64
const fileToBase64 = async (file: File): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const startInterview = async (resumeFile: File | null, resumeText: string, jdText: string): Promise<InterviewQuestion> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const jdSection = jdText.trim()
      ? `Job Description:\n${jdText}`
      : "Job Description: Not provided (general interview based on resume only).";
    const prompt = `
      You are an expert interviewer conducting a structured mock interview.
      
      ${QUESTION_RUBRIC}
      
      **Interview structure (strict):**
      - Total questions per mock: 10–14. Ask 2–3 questions max per experience point, then move on.
      - Use a mix of: (1) Technical, (2) Behavioral, (3) Scenario-based questions. Link each to JD/role context where possible.
      - If the resume suggests a fresher (recent grad, college projects, internships, little full-time experience), prefer fresher-appropriate questions (college projects, basic concepts, simplified scenarios). Otherwise use experienced-level technical/behavioral/scenario questions.
      - Do NOT give any feedback during the interview; only ask questions. Answers are captured for evaluation later.
      
      **Goal:** Generate the **first question** (id: 1).
      - It MUST be an introductory question: e.g. "Tell me about yourself" or "Walk me through your background".
      - Keep it short and conversational.
      - The optional 'context' field must be a SHORT label only (e.g. "Technical – Working capital", "Behavioral – Teamwork", "Scenario – Budget overrun"). Do NOT repeat or restate the question text in 'context'.
      - Return JSON with 'id', 'question', and optional 'context'.
      
      Resume:
      ${resumeText}
      
      ${jdSection}
    `;

    let contents: any;
    
    if (resumeFile) {
      const base64Data = await fileToBase64(resumeFile);
      contents = {
        parts: [
          { inlineData: { mimeType: resumeFile.type, data: base64Data } },
          { text: prompt }
        ]
      };
    } else {
      contents = prompt;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.INTEGER },
            question: { type: Type.STRING },
            context: { type: Type.STRING }
          },
          required: ["id", "question"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as InterviewQuestion;
    }
    throw new Error("Failed to start interview");

  } catch (error) {
    console.error("Error starting interview:", error);
    throw error;
  }
};

const getNextQuestion = async (
  currentHistory: { question: string; answer: string }[],
  resumeFile: File | null,
  resumeText: string,
  jdText: string
): Promise<InterviewResponse> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const lastExchange = currentHistory[currentHistory.length - 1];
    const previousExchanges = currentHistory.slice(0, -1);

    const jdSection = jdText.trim()
      ? `Job Description:\n${jdText}`
      : "Job Description: Not provided. Use only the resume to choose topics.";
    const totalQuestions = currentHistory.length;
    const prompt = `
      You are an expert interviewer. Use the question types and context below to choose the next question.
      
      ${QUESTION_RUBRIC}
      
      **Rules:**
      - 2–3 questions per experience point, then move on. Total: 10–14 per mock. Mix: technical, behavioral, scenario-based. No feedback—only capture answers.
      - If resume suggests fresher: use fresher-appropriate technical/behavioral/scenario questions. Else use experienced-level.
      - Current history (${totalQuestions} Q&A): ${JSON.stringify(previousExchanges)}
      - Latest: Q: "${lastExchange.question}" | Candidate: "${lastExchange.answer}"
      - If 2–3 Q on current point: move to next (resume/JD). If total would reach 14: set isComplete true, no nextQuestion.
      - Else return nextQuestion (id: ${totalQuestions + 1}), short (1–2 sentences). If "I don't know" or very weak: move to next topic.
      - If you include a 'context' field on nextQuestion, keep it as a SHORT label (e.g. "Technical – Excel", "Behavioral – Time management"). Do NOT repeat the question text in 'context'.
      
      Resume:
      ${resumeText}
      
      ${jdSection}
    `;

    let contents: any;
    
    if (resumeFile) {
      const base64Data = await fileToBase64(resumeFile);
      contents = {
        parts: [
          { inlineData: { mimeType: resumeFile.type, data: base64Data } },
          { text: prompt }
        ]
      };
    } else {
      contents = prompt;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isComplete: { type: Type.BOOLEAN },
            nextQuestion: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.INTEGER },
                question: { type: Type.STRING },
                context: { type: Type.STRING }
              },
              description: "The next question to ask, if isComplete is false."
            }
          },
          required: ["isComplete"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as InterviewResponse;
    }
    throw new Error("Failed to generate next question");

  } catch (error) {
    console.error("Error generating next question:", error);
    throw error;
  }
};

const evaluateInterviewSession = async (
  transcript: { question: string; answer: string }[],
  jdText: string,
  resumeText: string
): Promise<InterviewReport> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `
      You are an expert interviewer evaluating a candidate's mock interview. Use the rubric below to apply the right metrics per question type.
      
      ${QUESTION_RUBRIC}
      
      **Evaluation by question type:**
      - Technical questions: Weight Technical correctness, JD match, Thinking structure.
      - Behavioral questions: Weight Communication clarity, Thinking structure, Strengths/Weaknesses.
      - Scenario-based: Weight Thinking structure, Technical correctness, Communication clarity, JD match as applicable.
      Score each dimension 0–100 where relevant; then derive overall and per-Q scores.
      
      **Report requirements:**
      - overallScore: 0–100 (weighted average).
      - communicationScore, technicalScore, jdMatchScore, thinkingStructureScore: 0–100 each.
      - strengths: Top 3–5. weaknesses: Top 3–5.
      - skillGapAnalysis: Areas missing or weak for target JD (if JD provided).
      - hiringProbability: 0–100 % fit for the job.
      - improvementSuggestions: 3–5 personalized, actionable items.
      - summary: Brief executive summary.
      - questionEvaluations: For each Q&A, give feedback, score (1–10), and improvedAnswer. Consider the question type (technical/behavioral/scenario) and evaluate using the metrics linked to that type in the rubric.
      
      Be objective. If they said "I don't know", note as weakness but value honesty.

      Resume:
      ${resumeText}
      
      Job Description: ${jdText.trim() ? jdText : "Not provided (general interview)."}
      
      Transcript:
      ${JSON.stringify(transcript, null, 2)}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.INTEGER },
            communicationScore: { type: Type.INTEGER },
            technicalScore: { type: Type.INTEGER },
            jdMatchScore: { type: Type.INTEGER },
            thinkingStructureScore: { type: Type.INTEGER },
            summary: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            skillGapAnalysis: { type: Type.ARRAY, items: { type: Type.STRING } },
            hiringProbability: { type: Type.INTEGER },
            improvementSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            questionEvaluations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  answer: { type: Type.STRING },
                  feedback: { type: Type.STRING },
                  score: { type: Type.INTEGER },
                  improvedAnswer: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as InterviewReport;
    }
    throw new Error("No evaluation generated");

  } catch (error) {
    console.error("Error evaluating interview:", error);
    throw error;
  }
};

export const GeminiService = {
  startInterview,
  getNextQuestion,
  evaluateInterviewSession
};
