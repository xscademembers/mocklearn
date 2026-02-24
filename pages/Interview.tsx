import React, { useState, useRef, useEffect } from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Textarea,
  Badge,
} from '../components/UI';
import {
  Upload,
  FileText,
  Mic,
  AlertCircle,
  Loader2,
  ChevronRight,
  BarChart,
  MessageSquare,
  Cpu,
  RefreshCw,
  Play,
  StopCircle,
  Volume2,
  Download,
  Target,
  CheckCircle2,
  Lightbulb,
  Send,
} from 'lucide-react';
import { GeminiService } from '../services/gemini';
import { InterviewQuestion, InterviewReport, InterviewStatus } from '../types';

export const Interview: React.FC = () => {
  // State
  const [status, setStatus] = useState<InterviewStatus>(InterviewStatus.IDLE);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string>('');
  const [resumeInputMode, setResumeInputMode] = useState<'file' | 'text'>('file');
  const [jdText, setJdText] = useState<string>('');
  
  // Dynamic Questions State
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [report, setReport] = useState<InterviewReport | null>(null);

  // Result feedback (after interview)
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackError, setFeedbackError] = useState('');

  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const recognitionRef = useRef<any>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Interview timer (elapsed, no limit)
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  useEffect(() => {
    const isActive =
      status === InterviewStatus.READY ||
      status === InterviewStatus.IN_PROGRESS ||
      status === InterviewStatus.FETCHING_NEXT;
    if (!isActive) return;
    if (status === InterviewStatus.READY) setElapsedSeconds(0);
    const id = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [status]);
  const timerDisplay = `${Math.floor(elapsedSeconds / 60)
    .toString()
    .padStart(2, '0')}:${(elapsedSeconds % 60).toString().padStart(2, '0')}`;

  useEffect(() => {
    // Auto scroll to bottom when transcript updates
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentTranscript, status]);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript) {
          setCurrentTranscript(prev => prev + ' ' + finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
      };
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleStartInterview = async () => {
    const hasResume = resumeInputMode === 'file' ? resumeFile : resumeText.trim();
    if (!hasResume) return;

    setStatus(InterviewStatus.PARSING);
    try {
      const firstQuestion = await GeminiService.startInterview(
        resumeInputMode === 'file' ? resumeFile : null,
        resumeInputMode === 'text' ? resumeText : '',
        jdText.trim() || ''
      );
      setQuestions([firstQuestion]);
      setStatus(InterviewStatus.READY);
    } catch (error) {
      console.error(error);
      setStatus(InterviewStatus.ERROR);
    }
  };

  const handleNextQuestion = async () => {
    // Save Answer
    const currentQ = questions[currentQuestionIndex];
    const answerText = currentTranscript.trim() || "No answer provided.";
    const updatedAnswers = { ...answers, [currentQ.id]: answerText };
    setAnswers(updatedAnswers);
    setCurrentTranscript('');

    const history = questions.map(q => ({
      question: q.question,
      answer: updatedAnswers[q.id] || ""
    }));
    history[currentQuestionIndex] = { question: currentQ.question, answer: answerText };

    // Check limits
    if (questions.length >= 12) {
      await finishInterview(history);
      return;
    }

    // Fetch Next
    setStatus(InterviewStatus.FETCHING_NEXT);
    try {
      const response = await GeminiService.getNextQuestion(
        history, 
        resumeInputMode === 'file' ? resumeFile : null,
        resumeInputMode === 'text' ? resumeText : '',
        jdText
      );
      
      if (response.isComplete || !response.nextQuestion) {
        await finishInterview(history);
      } else {
        setQuestions(prev => [...prev, response.nextQuestion!]);
        setCurrentQuestionIndex(prev => prev + 1);
        setStatus(InterviewStatus.IN_PROGRESS);
      }
    } catch (error) {
      console.error(error);
      await finishInterview(history);
    }
  };

  const finishInterview = async (transcript: { question: string; answer: string }[]) => {
    setStatus(InterviewStatus.EVALUATING);
    try {
      const reportData = await GeminiService.evaluateInterviewSession(
        transcript,
        jdText,
        resumeInputMode === 'text' ? resumeText : ''
      );
      setReport(reportData);
      setStatus(InterviewStatus.COMPLETED);
    } catch (error) {
      console.error(error);
      setStatus(InterviewStatus.ERROR);
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    setFeedbackSubmitting(true);
    setFeedbackError('');
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          feedback: feedbackText.trim(),
          overallScore: report?.overallScore ?? null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to submit feedback');
      }
      setFeedbackSubmitted(true);
      setFeedbackText('');
    } catch (err) {
      setFeedbackError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  // Download Report as PDF/HTML
  const handleDownloadReport = () => {
    if (!report) return;
    
    const reportHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MockLearn Interview Report</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px 20px; color: #333; }
    h1 { color: #4f46e5; text-align: center; margin-bottom: 10px; }
    .subtitle { text-align: center; color: #666; margin-bottom: 30px; }
    .scores { display: flex; flex-wrap: wrap; justify-content: center; gap: 15px; margin: 30px 0; }
    .score-card { text-align: center; padding: 20px; background: #f3f4f6; border-radius: 10px; min-width: 100px; flex: 1; }
    .score-value { font-size: 28px; font-weight: bold; color: #4f46e5; }
    .score-label { font-size: 12px; color: #666; margin-top: 5px; }
    .section { margin: 30px 0; }
    .section-title { font-size: 18px; font-weight: bold; margin-bottom: 15px; padding-bottom: 5px; border-bottom: 2px solid #4f46e5; }
    .summary { background: #f3f4f6; padding: 20px; border-radius: 10px; line-height: 1.6; }
    ul { padding-left: 20px; }
    li { margin: 8px 0; }
    .strength { color: #4f46e5; }
    .weakness { color: #dc2626; }
    .improvement { color: #2563eb; }
    .qa-item { background: #f9fafb; padding: 15px; margin: 15px 0; border-radius: 10px; border-left: 4px solid #4f46e5; }
    .qa-question { font-weight: bold; margin-bottom: 10px; font-size: 14px; }
    .qa-answer { font-style: italic; color: #666; margin-bottom: 10px; font-size: 13px; }
    .qa-feedback { margin: 10px 0; font-size: 13px; }
    .qa-improved { background: #eef2ff; padding: 10px; border-radius: 5px; margin-top: 10px; font-size: 13px; }
    .qa-score { display: inline-block; background: #4f46e5; color: white; padding: 2px 10px; border-radius: 15px; font-size: 12px; }
    .footer { text-align: center; margin-top: 40px; color: #999; font-size: 12px; }
    @media (max-width: 600px) {
      .scores { flex-direction: column; }
      .score-card { min-width: auto; }
    }
  </style>
</head>
<body>
  <h1>🎯 MockLearn Interview Report</h1>
  <p class="subtitle">AI-Generated Performance Analysis</p>
  
  <div class="scores">
    <div class="score-card">
      <div class="score-value">${report.overallScore}</div>
      <div class="score-label">Overall (out of 100)</div>
    </div>
    <div class="score-card">
      <div class="score-value">${report.communicationScore}%</div>
      <div class="score-label">Communication</div>
    </div>
    <div class="score-card">
      <div class="score-value">${report.technicalScore}%</div>
      <div class="score-label">Technical</div>
    </div>
    <div class="score-card">
      <div class="score-value">${report.jdMatchScore ?? 'N/A'}%</div>
      <div class="score-label">JD Match</div>
    </div>
    ${report.thinkingStructureScore != null ? `<div class="score-card"><div class="score-value">${report.thinkingStructureScore}%</div><div class="score-label">Thinking</div></div>` : ''}
    ${report.hiringProbability != null ? `<div class="score-card"><div class="score-value">${report.hiringProbability}%</div><div class="score-label">Hiring Probability</div></div>` : ''}
  </div>

  <div class="section">
    <div class="section-title">📝 Executive Summary</div>
    <div class="summary">${report.summary}</div>
  </div>

  <div class="section">
    <div class="section-title">✅ Strengths (top 3–5)</div>
    <ul>
      ${report.strengths.map(s => `<li class="strength">${s}</li>`).join('')}
    </ul>
  </div>

  <div class="section">
    <div class="section-title">⚠️ Weaknesses (top 3–5)</div>
    <ul>
      ${report.weaknesses.map(w => `<li class="weakness">${w}</li>`).join('')}
    </ul>
  </div>

  ${report.skillGapAnalysis && report.skillGapAnalysis.length > 0 ? `
  <div class="section">
    <div class="section-title">📐 Skill Gap Analysis</div>
    <p style="color:#666;font-size:13px;">Areas missing or weak for the target JD</p>
    <ul>
      ${report.skillGapAnalysis.map(g => `<li class="improvement">${g}</li>`).join('')}
    </ul>
  </div>
  ` : ''}

  ${report.hiringProbability != null ? `
  <div class="section">
    <div class="section-title">🎯 Hiring Probability</div>
    <p style="font-size:24px;font-weight:bold;color:#059669;">${report.hiringProbability}%</p>
    <p style="color:#666;font-size:13px;">Estimated fit for the job based on your responses</p>
  </div>
  ` : ''}

  ${report.improvementSuggestions && report.improvementSuggestions.length > 0 ? `
  <div class="section">
    <div class="section-title">💡 Suggested Improvements</div>
    <ul>
      ${report.improvementSuggestions.map(s => `<li class="improvement">${s}</li>`).join('')}
    </ul>
  </div>
  ` : ''}

  <div class="section">
    <div class="section-title">📊 Question-by-Question Analysis</div>
    ${report.questionEvaluations.map((item, idx) => `
      <div class="qa-item">
        <div class="qa-question">Q${idx + 1}: ${item.question}</div>
        <div class="qa-answer">"${item.answer}"</div>
        <span class="qa-score">Score: ${item.score}/10</span>
        <div class="qa-feedback"><strong>Feedback:</strong> ${item.feedback}</div>
        <div class="qa-improved"><strong>💡 Better Answer:</strong> ${item.improvedAnswer}</div>
      </div>
    `).join('')}
  </div>

  <div class="footer">
    Generated by MockLearn.com | ${new Date().toLocaleDateString()}
  </div>
</body>
</html>
    `;
    
    const blob = new Blob([reportHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MockLearn_Interview_Report_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // --- Views ---

  const renderSetup = () => (
    <div className="min-h-[calc(100vh-56px)] sm:min-h-[calc(100vh-64px)] flex flex-col justify-center max-w-4xl mx-auto py-4 sm:py-6 px-4 sm:px-6 animate-fade-in-up">
      <div className="text-center mb-4 sm:mb-6 space-y-1 sm:space-y-2">
        <Badge variant="secondary" className="mb-1 sm:mb-2">Start Interview</Badge>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">Configure Your Interview</h1>
        <p className="text-xs sm:text-sm text-muted-foreground">Upload your materials to let the AI tailor the experience.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Upload Resume */}
        <Card className="hover:shadow-md transition-shadow border-2 border-transparent hover:border-indigo-100">
          <CardHeader className="pb-2 sm:pb-3 p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
              <div className="p-1.5 rounded bg-indigo-100 text-indigo-600"><FileText className="h-4 w-4" /></div>
              Resume
            </CardTitle>
            {/* Toggle between file and text */}
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setResumeInputMode('file')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  resumeInputMode === 'file' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                Upload PDF
              </button>
              <button
                onClick={() => setResumeInputMode('text')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  resumeInputMode === 'text' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                Paste Text
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            {resumeInputMode === 'file' ? (
              <div className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/5 p-4 sm:p-6 transition-colors hover:bg-muted/10 h-32 sm:h-40 text-center">
                 <input 
                   type="file" 
                   accept="application/pdf"
                   onChange={handleResumeUpload}
                   className="absolute inset-0 cursor-pointer opacity-0"
                 />
                 {resumeFile ? (
                   <div className="space-y-1 sm:space-y-2">
                     <FileText className="h-8 w-8 sm:h-10 sm:w-10 text-indigo-600 mx-auto" />
                     <p className="font-medium text-xs sm:text-sm text-indigo-600 break-all px-2 line-clamp-1">{resumeFile.name}</p>
                     <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">Ready</Badge>
                   </div>
                 ) : (
                   <div className="space-y-1 sm:space-y-2">
                     <div className="h-8 w-8 sm:h-10 sm:w-10 bg-muted rounded-full flex items-center justify-center mx-auto">
                       <Upload className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                     </div>
                     <div>
                       <p className="font-medium text-xs sm:text-sm">Click to upload PDF</p>
                       <p className="text-xs text-muted-foreground">or drag and drop</p>
                     </div>
                   </div>
                 )}
              </div>
            ) : (
              <Textarea 
                placeholder="Paste your resume content here..."
                className="h-32 sm:h-40 resize-none p-3 text-xs sm:text-sm bg-muted/5 border-muted-foreground/25 focus:bg-background transition-colors"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
            )}
          </CardContent>
        </Card>

        {/* Job Description (Optional) */}
        <Card className="hover:shadow-md transition-shadow border-2 border-transparent hover:border-violet-100">
          <CardHeader className="pb-2 sm:pb-3 p-4 sm:p-6">
             <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
               <div className="p-1.5 rounded bg-violet-100 text-violet-600"><FileText className="h-4 w-4" /></div>
               Job Description <span className="text-xs font-normal text-muted-foreground">(Optional)</span>
             </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
             <Textarea 
               placeholder="Paste the full job description here..." 
               className="h-32 sm:h-40 md:h-[168px] resize-none p-3 text-xs sm:text-sm bg-muted/5 border-muted-foreground/25 focus:bg-background transition-colors"
               value={jdText}
               onChange={(e) => setJdText(e.target.value)}
             />
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 sm:mt-6 flex justify-center">
        <Button 
          size="lg" 
          className="w-full sm:w-auto sm:min-w-[280px] h-11 sm:h-12 text-sm sm:text-base rounded-full shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all bg-indigo-600 hover:bg-indigo-700"
          disabled={
            (resumeInputMode === 'file' ? !resumeFile : !resumeText.trim()) ||
            status === InterviewStatus.PARSING
          }
          onClick={handleStartInterview}
        >
          {status === InterviewStatus.PARSING ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...
            </>
          ) : (
            <>Start Interview <Play className="ml-2 h-4 w-4" /></>
          )}
        </Button>
      </div>
    </div>
  );

  const renderActiveInterview = () => {
    const question = questions[currentQuestionIndex];
    const isFetching = status === InterviewStatus.FETCHING_NEXT;

    return (
      <div className="max-w-4xl mx-auto min-h-[calc(100vh-140px)] flex flex-col animate-fade-in px-4 sm:px-6 py-4">
        {/* Header Status */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider">Question {currentQuestionIndex + 1}</span>
            <span className="text-xs sm:text-sm font-mono font-semibold text-primary bg-primary/10 px-2 py-1 rounded" aria-label="Elapsed time">{timerDisplay}</span>
            {isRecording && <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" aria-hidden></span>}
          </div>
          <Button variant="ghost" size="sm" className="text-xs sm:text-sm text-muted-foreground hover:text-destructive h-8 px-2 sm:px-3" onClick={() => window.location.reload()}>End Session</Button>
        </div>

        {/* Main Interaction Area */}
        <div className="flex-1 flex flex-col gap-4 sm:gap-6 overflow-hidden">
          
          {/* AI Question Bubble */}
          <div className="bg-gradient-to-br from-white to-slate-50 border rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-sm relative">
             <div className="flex gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-indigo-600 flex-shrink-0 flex items-center justify-center text-white shadow-lg">
                   <Volume2 className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div className="space-y-2 flex-1 min-w-0">
                   <h2 className="text-lg sm:text-2xl md:text-3xl font-semibold leading-tight text-foreground">
                     {question.question}
                   </h2>
                   {question.context && (
                     <p className="text-muted-foreground italic text-xs sm:text-sm border-l-2 border-indigo-500/30 pl-2 sm:pl-3">
                       Context: {question.context}
                     </p>
                   )}
                </div>
             </div>
          </div>

          {/* User Answer Area */}
          <div className="flex-1 bg-card border rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-inner flex flex-col relative overflow-hidden min-h-[200px]">
             {/* Text Area */}
             <Textarea 
               value={currentTranscript}
               onChange={(e) => setCurrentTranscript(e.target.value)}
               className="flex-1 resize-none border-none bg-transparent text-base sm:text-xl leading-relaxed focus-visible:ring-0 p-0 placeholder:text-muted-foreground/30"
               placeholder="Your answer will appear here as you speak... or type your answer directly"
             />
             
             {/* Audio Visualization / Controls */}
             <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-4">
                <div className="flex items-center gap-3 sm:gap-4">
                   <button 
                     onClick={toggleRecording}
                     className={`
                       relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-300
                       ${isRecording ? 'bg-red-500 text-white shadow-red-500/50 shadow-lg' : 'bg-indigo-600 text-white shadow-lg hover:scale-105'}
                     `}
                   >
                     {isRecording && (
                       <span className="absolute inset-0 rounded-full border-4 border-red-500 opacity-50 animate-pulse-ring"></span>
                     )}
                     {isRecording ? <StopCircle className="h-6 w-6 sm:h-8 sm:w-8" /> : <Mic className="h-6 w-6 sm:h-8 sm:w-8" />}
                   </button>
                   <div className="text-xs sm:text-sm text-muted-foreground">
                      {isRecording ? "Listening..." : "Click mic or type"}
                   </div>
                </div>

                <Button 
                  onClick={handleNextQuestion} 
                  disabled={isRecording || isFetching || (!currentTranscript.trim() && !isRecording)}
                  size="lg"
                  className="w-full sm:w-auto rounded-full px-6 sm:px-8 h-11 sm:h-12 bg-indigo-600 hover:bg-indigo-700"
                >
                  {isFetching ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing
                    </>
                  ) : (
                    <>
                      Next <ChevronRight className="ml-1 sm:ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
             </div>
          </div>
        </div>
      </div>
    );
  };

  const renderEvaluating = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in space-y-6 sm:space-y-8 px-4">
       <div className="relative">
         <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-pulse"></div>
         <Loader2 className="h-16 w-16 sm:h-20 sm:w-20 text-indigo-600 animate-spin relative z-10" />
       </div>
       <div className="space-y-2 sm:space-y-3 max-w-md mx-auto">
         <h2 className="text-xl sm:text-2xl font-bold">Generating Report</h2>
         <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600 animate-progress origin-left w-full" style={{ animationDuration: '2s' }}></div>
         </div>
         <p className="text-muted-foreground text-xs sm:text-sm">Evaluating technical accuracy, communication style, and JD match...</p>
       </div>
    </div>
  );

  const ResultTypingHeading = () => {
    const fullText = 'Viewing your results...';
    const [text, setText] = useState('');
    const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    useEffect(() => {
      if (reducedMotion) {
        setText(fullText);
        return;
      }
      setText('');
      let i = 0;
      const id = setInterval(() => {
        i += 1;
        setText(fullText.slice(0, i));
        if (i >= fullText.length) clearInterval(id);
      }, 80);
      return () => clearInterval(id);
    }, [reducedMotion]);
    return (
      <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight min-h-[1.2em]">
        {text}
        {!reducedMotion && text.length < fullText.length && (
          <span className="animate-pulse" style={{ animationDuration: '0.8s' }}>|</span>
        )}
      </h1>
    );
  };

  const ScoreCard = ({ title, score, icon: Icon, colorClass }: any) => (
    <Card className="overflow-hidden relative">
      <div className={`absolute top-0 right-0 p-2 sm:p-4 opacity-10 ${colorClass}`}>
        <Icon className="h-16 w-16 sm:h-24 sm:w-24" />
      </div>
      <CardContent className="p-4 sm:p-6">
         <div className="flex justify-between items-start mb-3 sm:mb-4">
           <div className={`p-1.5 sm:p-2 rounded-lg ${colorClass} bg-opacity-10`}>
             <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${colorClass}`} />
           </div>
           <span className="text-2xl sm:text-3xl font-bold">{score}%</span>
         </div>
         <h3 className="font-semibold text-sm sm:text-lg">{title}</h3>
         <div className="mt-2 sm:mt-3 h-1.5 sm:h-2 w-full bg-muted rounded-full overflow-hidden">
           <div 
             className={`h-full rounded-full transition-all duration-1000 ${colorClass.replace('text-', 'bg-')}`} 
             style={{ width: `${score}%` }}
           ></div>
         </div>
      </CardContent>
    </Card>
  );

  const renderReport = () => {
    if (!report) return null;

    const scoreBarData = [
      { name: 'Overall', score: report.overallScore, fill: 'hsl(239, 84%, 67%)' },
      { name: 'Communication', score: report.communicationScore, fill: 'hsl(217, 91%, 60%)' },
      { name: 'Technical', score: report.technicalScore, fill: 'hsl(262, 83%, 58%)' },
      { name: 'JD Match', score: report.jdMatchScore || 0, fill: 'hsl(25, 95%, 53%)' },
    ];
    const strengthsCount = report.strengths.length;
    const weaknessesCount = report.weaknesses.length;
    const pieDataRaw = [
      { name: 'Strengths', value: strengthsCount, color: 'hsl(239, 84%, 67%)' },
      { name: 'Areas to Improve', value: weaknessesCount, color: 'hsl(38, 92%, 50%)' },
    ].filter((d) => d.value > 0);
    const pieData = pieDataRaw.length > 0 ? pieDataRaw : [{ name: 'N/A', value: 1, color: 'hsl(0,0%,70%)' }];

    return (
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 animate-fade-in-up pb-12 sm:pb-20 px-4 sm:px-6">
        <div className="text-center space-y-3 sm:space-y-4 pt-4 sm:pt-8">
           <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200 px-3 sm:px-4 py-1 text-xs sm:text-sm">Evaluation Complete</Badge>
           <ResultTypingHeading />
           <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto">Detailed breakdown of your mock interview session</p>
           
           <Button 
             onClick={handleDownloadReport} 
             size="lg" 
             variant="outline" 
             className="mt-2 sm:mt-4 gap-2 h-10 sm:h-11 text-sm"
           >
             <Download className="h-4 w-4 sm:h-5 sm:w-5" /> Download Report
           </Button>
        </div>

        {/* Executive Summary + Strengths/Weaknesses — no gap below */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
           <Card className="lg:col-span-2 border-indigo-100 shadow-lg">
             <CardHeader className="pb-2 sm:pb-3">
               <CardTitle className="text-lg sm:text-xl">Executive Summary</CardTitle>
             </CardHeader>
             <CardContent className="pt-0">
               <p className="text-base sm:text-[18px] leading-relaxed text-muted-foreground">{report.summary}</p>
             </CardContent>
           </Card>

           <div className="space-y-3 sm:space-y-4">
             <Card className="border-green-100 bg-green-50/30">
               <CardHeader className="pb-1 sm:pb-2">
                 <CardTitle className="text-green-700 text-base sm:text-lg flex items-center gap-2">
                   <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" /> Strengths (top 3–5)
                 </CardTitle>
               </CardHeader>
               <CardContent className="pt-0">
                 <ul className="space-y-2 sm:space-y-2.5">
                   {report.strengths.map((s, i) => (
                     <li key={i} className="flex items-start gap-2 text-sm sm:text-[18px] leading-snug text-green-900">
                       <span className="mt-2 h-1.5 w-1.5 rounded-full bg-green-600 shrink-0" aria-hidden /> {s}
                     </li>
                   ))}
                 </ul>
               </CardContent>
             </Card>
             <Card className="border-amber-100 bg-amber-50/30">
               <CardHeader className="pb-1 sm:pb-2">
                 <CardTitle className="text-amber-700 text-base sm:text-lg flex items-center gap-2">
                   <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" /> Weaknesses (top 3–5)
                 </CardTitle>
               </CardHeader>
               <CardContent className="pt-0">
                 <ul className="space-y-2 sm:space-y-2.5">
                   {report.weaknesses.map((w, i) => (
                     <li key={i} className="flex items-start gap-2 text-sm sm:text-[18px] leading-snug text-amber-900">
                       <span className="mt-2 h-1.5 w-1.5 rounded-full bg-amber-600 shrink-0" aria-hidden /> {w}
                     </li>
                   ))}
                 </ul>
               </CardContent>
             </Card>
           </div>
        </div>

        {/* Bar & Pie Charts — directly below summary, no gap */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <Card className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-base sm:text-lg">Score Overview</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-56 sm:h-64 w-full min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={scoreBarData} layout="vertical" margin={{ left: 8, right: 8 }}>
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                    <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="score" radius={[0, 4, 4, 0]} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-base sm:text-lg">Strengths vs Areas to Improve</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-56 sm:h-64 w-full min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Score cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
           <ScoreCard title="Overall" score={report.overallScore} icon={BarChart} colorClass="text-indigo-600" />
           <ScoreCard title="Communication" score={report.communicationScore} icon={MessageSquare} colorClass="text-blue-500" />
           <ScoreCard title="Technical" score={report.technicalScore} icon={Cpu} colorClass="text-purple-500" />
           <ScoreCard title="JD Match" score={report.jdMatchScore ?? 0} icon={Target} colorClass="text-orange-500" />
           {report.thinkingStructureScore != null && (
             <ScoreCard title="Thinking" score={report.thinkingStructureScore} icon={Lightbulb} colorClass="text-cyan-500" />
           )}
        </div>

        {/* Skill Gap Analysis */}
        {report.skillGapAnalysis && report.skillGapAnalysis.length > 0 && (
          <Card className="border-violet-200 bg-violet-50/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-violet-800 text-base sm:text-lg flex items-center gap-2">
                <Target className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" /> Skill Gap Analysis
              </CardTitle>
              <p className="text-sm sm:text-base text-violet-700/80">Areas missing or weak for the target role</p>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-2 sm:space-y-2.5">
                {report.skillGapAnalysis.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm sm:text-[18px] leading-snug text-violet-900">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-violet-500 shrink-0" aria-hidden /> {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Hiring Probability (if not in score cards) */}
        {report.hiringProbability != null && (
          <Card className="border-emerald-200 bg-emerald-50/20">
            <CardContent className="py-4 sm:py-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="text-3xl sm:text-4xl font-bold text-emerald-700">{report.hiringProbability}%</div>
              <div>
                <h3 className="font-semibold text-emerald-800 text-base sm:text-lg">Hiring Probability</h3>
                <p className="text-sm sm:text-[18px] text-muted-foreground">Estimated fit for the job based on your responses</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Suggested Improvements */}
        {report.improvementSuggestions && report.improvementSuggestions.length > 0 && (
          <Card className="border-blue-100 bg-blue-50/30">
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-blue-700 flex items-center gap-2 text-base sm:text-lg">
                <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" /> Suggested Improvements
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {report.improvementSuggestions.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 sm:gap-3 text-sm sm:text-[18px] leading-snug text-blue-900 bg-white p-3 sm:p-4 rounded-lg border border-blue-100">
                    <span className="flex items-center justify-center h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-blue-500 text-white text-sm font-bold shrink-0">{i + 1}</span>
                    {s}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Detailed Breakdown */}
        <div className="space-y-4 sm:space-y-6">
           <div className="flex items-center gap-2 sm:gap-4">
             <div className="h-px bg-border flex-1" aria-hidden />
             <h2 className="text-lg sm:text-2xl font-bold text-foreground text-center">Question Analysis</h2>
             <div className="h-px bg-border flex-1" aria-hidden />
           </div>

           <div className="grid gap-4 sm:gap-6">
             {report.questionEvaluations.map((item, idx) => (
               <Card key={idx} className="group hover:border-indigo-200 transition-colors overflow-hidden">
                 <CardHeader className="bg-muted/30 pb-3 sm:pb-4 p-4 sm:p-6">
                   <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                     <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                       <span className="flex items-center justify-center h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-indigo-600 text-white font-bold text-sm shrink-0">
                         {idx + 1}
                       </span>
                       <h3 className="text-base sm:text-lg font-semibold leading-tight">{item.question}</h3>
                     </div>
                     <Badge variant={item.score > 7 ? 'default' : item.score > 4 ? 'secondary' : 'destructive'} className="w-fit text-xs shrink-0">
                       {item.score}/10
                     </Badge>
                   </div>
                 </CardHeader>
                 <CardContent className="pt-4 sm:pt-6 space-y-4 sm:space-y-6 p-4 sm:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1 sm:gap-2">
                          <Mic className="h-3 w-3 shrink-0" /> Your Answer
                        </h4>
                        <div className="p-3 sm:p-4 rounded-lg bg-muted/20 text-sm sm:text-[18px] italic text-foreground/80 border leading-relaxed">
                          "{item.answer}"
                        </div>
                      </div>
                      <div>
                         <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1 sm:gap-2">
                          <MessageSquare className="h-3 w-3 shrink-0" /> AI Feedback
                        </h4>
                        <p className="text-sm sm:text-[18px] text-muted-foreground leading-relaxed">
                          {item.feedback}
                        </p>
                      </div>
                    </div>
                    
                    <div className="relative overflow-hidden rounded-lg bg-indigo-50/50 p-3 sm:p-4 border border-indigo-100">
                       <div className="absolute top-0 left-0 w-1 h-full bg-indigo-400" aria-hidden />
                       <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1 flex items-center gap-1 sm:gap-2">
                         <RefreshCw className="h-3 w-3 shrink-0" /> Better Answer
                       </h4>
                       <p className="text-sm sm:text-[18px] font-medium text-indigo-900 leading-relaxed">
                         {item.improvedAnswer}
                       </p>
                    </div>
                 </CardContent>
               </Card>
             ))}
           </div>
        </div>

        {/* Feedback after interview */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <MessageSquare className="h-5 w-5 shrink-0" />
              Share your feedback
            </CardTitle>
            <p className="text-sm sm:text-base text-muted-foreground">Your feedback helps us improve the interview experience.</p>
          </CardHeader>
          <CardContent>
            {feedbackSubmitted ? (
              <div className="py-4 text-center text-muted-foreground">
                <CheckCircle2 className="h-10 w-10 mx-auto mb-2 text-primary" />
                <p>Thank you for your feedback!</p>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <Textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="How was your experience? What could we do better?"
                  className="min-h-[100px] resize-none"
                  required
                />
                {feedbackError && <p className="text-sm text-destructive" role="alert">{feedbackError}</p>}
                <Button type="submit" disabled={feedbackSubmitting} className="gap-2">
                  {feedbackSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {feedbackSubmitting ? 'Sending...' : 'Submit Feedback'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
        
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 pt-4 sm:pt-8">
           <Button onClick={handleDownloadReport} variant="outline" size="lg" className="rounded-full px-6 sm:px-8 h-11 sm:h-12 text-sm sm:text-base gap-2 order-2 sm:order-1">
             <Download className="h-4 w-4 sm:h-5 sm:w-5" /> Download
           </Button>
           <Button onClick={() => window.location.reload()} size="lg" className="rounded-full px-6 sm:px-8 h-11 sm:h-12 text-sm sm:text-base shadow-xl bg-indigo-600 hover:bg-indigo-700 order-1 sm:order-2">
             Start New Interview
           </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-[85vh]">
      {status === InterviewStatus.IDLE && renderSetup()}
      {status === InterviewStatus.PARSING && (
         <div className="flex flex-col items-center justify-center h-[60vh] space-y-4 sm:space-y-6 animate-fade-in-up px-4">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-pulse"></div>
              <Loader2 className="h-12 w-12 sm:h-16 sm:w-16 animate-spin text-indigo-600 relative z-10" />
            </div>
            <p className="text-base sm:text-xl font-medium text-muted-foreground">Analysing your profile...</p>
         </div>
      )}
      {(status === InterviewStatus.READY || status === InterviewStatus.IN_PROGRESS || status === InterviewStatus.FETCHING_NEXT) && renderActiveInterview()}
      {status === InterviewStatus.EVALUATING && renderEvaluating()}
      {status === InterviewStatus.COMPLETED && renderReport()}
      {status === InterviewStatus.ERROR && (
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4 sm:space-y-6 animate-fade-in-up px-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle className="h-7 w-7 sm:h-8 sm:w-8 text-red-600" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-lg sm:text-xl font-semibold">Something went wrong</h2>
            <p className="text-muted-foreground text-sm">Please check your API key and try again.</p>
          </div>
          <Button onClick={() => window.location.reload()} className="bg-indigo-600 hover:bg-indigo-700">
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
};
