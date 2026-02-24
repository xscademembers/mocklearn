import { InterviewQuestion, InterviewReport, InterviewResponse } from "../types";

const API_BASE = "/api/interview";

async function post<T>(path: string, body: object): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || res.statusText || "Request failed");
  }
  return data as T;
}

// Helper to convert file to base64 (used by client when sending to server)
const fileToBase64 = async (file: File): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      resolve(base64 || "");
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const startInterview = async (
  resumeFile: File | null,
  resumeText: string,
  jdText: string
): Promise<InterviewQuestion> => {
  const body: { resumeText: string; jdText: string; resumeBase64?: string; mimeType?: string } = {
    resumeText,
    jdText,
  };
  if (resumeFile) {
    body.resumeBase64 = await fileToBase64(resumeFile);
    body.mimeType = resumeFile.type;
  }
  return post<InterviewQuestion>("/start", body);
};

const getNextQuestion = async (
  currentHistory: { question: string; answer: string }[],
  resumeFile: File | null,
  resumeText: string,
  jdText: string
): Promise<InterviewResponse> => {
  const body: {
    history: { question: string; answer: string }[];
    resumeText: string;
    jdText: string;
    resumeBase64?: string;
    mimeType?: string;
  } = {
    history: currentHistory,
    resumeText,
    jdText,
  };
  if (resumeFile) {
    body.resumeBase64 = await fileToBase64(resumeFile);
    body.mimeType = resumeFile.type;
  }
  return post<InterviewResponse>("/next", body);
};

const evaluateInterviewSession = async (
  transcript: { question: string; answer: string }[],
  jdText: string,
  resumeText: string
): Promise<InterviewReport> => {
  return post<InterviewReport>("/evaluate", { transcript, jdText, resumeText });
};

export const GeminiService = {
  startInterview,
  getNextQuestion,
  evaluateInterviewSession,
};
