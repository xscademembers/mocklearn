import express from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import { QUESTION_RUBRIC } from '../interviewRubric.js';

const router = express.Router();

function getApiKey() {
  const key = (process.env.GEMINI_API_KEY || process.env.API_KEY || '').trim();
  if (!key) {
    throw new Error('GEMINI_API_KEY (or API_KEY) is not set. Add it to .env.local in the project root and restart the dev server.');
  }
  return key;
}

// GET /api/interview/check — verify API key is loaded (for debugging)
router.get('/check', (_req, res) => {
  try {
    getApiKey();
    res.json({ ok: true, keyConfigured: true });
  } catch (e) {
    res.status(503).json({ ok: false, keyConfigured: false, error: e.message });
  }
});

// POST /api/interview/start
router.post('/start', async (req, res) => {
  try {
    const { resumeText = '', jdText = '', resumeBase64, mimeType } = req.body;
    const ai = new GoogleGenAI({ apiKey: getApiKey() });

    const jdSection = jdText.trim()
      ? `Job Description:\n${jdText}`
      : 'Job Description: Not provided (general interview based on resume only).';
    const prompt = `
      You are an expert interviewer conducting a structured mock interview.
      
      ${QUESTION_RUBRIC}
      
      **Interview structure (strict):**
      - Total questions per mock: 10–12. Ask 2–3 questions max per experience point, then move on.
      - Use a mix of: (1) Technical, (2) Behavioral, (3) Scenario-based questions. Link each to JD/role context where possible.
      - If the resume suggests a fresher (recent grad, college projects, internships, little full-time experience), prefer fresher-appropriate questions (college projects, basic concepts, simplified scenarios). Otherwise use experienced-level technical/behavioral/scenario questions.
      - Do NOT give any feedback during the interview; only ask questions. Answers are captured for evaluation later.
      
      **Goal:** Generate the **first question** (id: 1).
      - It MUST be an introductory question: e.g. "Tell me about yourself" or "Walk me through your background".
      - Keep it short and conversational.
      - Return JSON with 'id', 'question', and optional 'context' (e.g. "intro" or experience point / JD link).
      
      Resume:
      ${resumeText}
      
      ${jdSection}
    `;

    let contents;
    if (resumeBase64 && mimeType) {
      contents = {
        parts: [
          { inlineData: { mimeType, data: resumeBase64 } },
          { text: prompt }
        ]
      };
    } else {
      contents = prompt;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.INTEGER },
            question: { type: Type.STRING },
            context: { type: Type.STRING }
          },
          required: ['id', 'question']
        }
      }
    });

    if (response.text) {
      return res.json(JSON.parse(response.text));
    }
    return res.status(500).json({ error: 'Failed to start interview' });
  } catch (err) {
    console.error('[interview/start]', err);
    if (err.status === 429 || (err.message && err.message.includes('RESOURCE_EXHAUSTED'))) {
      return res.status(429).json({
        error: 'Gemini API quota exceeded. Check your plan and billing at https://ai.google.dev/gemini-api/docs/rate-limits or try again later.',
        code: 'QUOTA_EXCEEDED'
      });
    }
    const status = err.message?.includes('GEMINI_API_KEY') ? 503 : 500;
    res.status(status).json({ error: err.message || 'Server error' });
  }
});

// POST /api/interview/next
router.post('/next', async (req, res) => {
  try {
    const { history = [], resumeText = '', jdText = '', resumeBase64, mimeType } = req.body;
    if (!Array.isArray(history) || history.length === 0) {
      return res.status(400).json({ error: 'history is required' });
    }
    const ai = new GoogleGenAI({ apiKey: getApiKey() });

    const lastExchange = history[history.length - 1];
    const previousExchanges = history.slice(0, -1);
    const jdSection = jdText.trim()
      ? `Job Description:\n${jdText}`
      : 'Job Description: Not provided. Use only the resume to choose topics.';
    const totalQuestions = history.length;
    const prompt = `
      You are an expert interviewer. Use the question types and context below to choose the next question.
      
      ${QUESTION_RUBRIC}
      
      **Rules:**
      - 2–3 questions per experience point, then move on. Total: 10–12 per mock. Mix: technical, behavioral, scenario-based. No feedback—only capture answers.
      - If resume suggests fresher: use fresher-appropriate technical/behavioral/scenario questions. Else use experienced-level.
      - Current history (${totalQuestions} Q&A): ${JSON.stringify(previousExchanges)}
      - Latest: Q: "${lastExchange.question}" | Candidate: "${lastExchange.answer}"
      - If 2–3 Q on current point: move to next (resume/JD). If total would reach 10–12: set isComplete true, no nextQuestion.
      - Else return nextQuestion (id: ${totalQuestions + 1}), short (1–2 sentences). If "I don't know" or very weak: move to next topic.
      
      Resume:
      ${resumeText}
      
      ${jdSection}
    `;

    let contents;
    if (resumeBase64 && mimeType) {
      contents = {
        parts: [
          { inlineData: { mimeType, data: resumeBase64 } },
          { text: prompt }
        ]
      };
    } else {
      contents = prompt;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        responseMimeType: 'application/json',
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
              description: 'The next question to ask, if isComplete is false.'
            }
          },
          required: ['isComplete']
        }
      }
    });

    if (response.text) {
      return res.json(JSON.parse(response.text));
    }
    return res.status(500).json({ error: 'Failed to generate next question' });
  } catch (err) {
    console.error('[interview/next]', err);
    if (err.status === 429 || (err.message && err.message.includes('RESOURCE_EXHAUSTED'))) {
      return res.status(429).json({
        error: 'Gemini API quota exceeded. Check your plan and billing at https://ai.google.dev/gemini-api/docs/rate-limits or try again later.',
        code: 'QUOTA_EXCEEDED'
      });
    }
    const status = err.message?.includes('GEMINI_API_KEY') ? 503 : 500;
    res.status(status).json({ error: err.message || 'Server error' });
  }
});

// POST /api/interview/evaluate
router.post('/evaluate', async (req, res) => {
  try {
    const { transcript = [], jdText = '', resumeText = '' } = req.body;
    if (!Array.isArray(transcript)) {
      return res.status(400).json({ error: 'transcript is required' });
    }
    const ai = new GoogleGenAI({ apiKey: getApiKey() });

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
      
      Job Description: ${jdText.trim() ? jdText : 'Not provided (general interview).'}
      
      Transcript:
      ${JSON.stringify(transcript, null, 2)}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
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
      return res.json(JSON.parse(response.text));
    }
    return res.status(500).json({ error: 'No evaluation generated' });
  } catch (err) {
    console.error('[interview/evaluate]', err);
    if (err.status === 429 || (err.message && err.message.includes('RESOURCE_EXHAUSTED'))) {
      return res.status(429).json({
        error: 'Gemini API quota exceeded. Check your plan and billing at https://ai.google.dev/gemini-api/docs/rate-limits or try again later.',
        code: 'QUOTA_EXCEEDED'
      });
    }
    const status = err.message?.includes('GEMINI_API_KEY') ? 503 : 500;
    res.status(status).json({ error: err.message || 'Server error' });
  }
});

export default router;
