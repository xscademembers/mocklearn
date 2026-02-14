import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from '../components/UI';
import { 
  CheckCircle2, 
  Mic, 
  FileText, 
  BrainCircuit, 
  ArrowRight, 
  Star, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck,
  Upload,
  BarChart3,
  Target,
  MessageSquare,
  Lightbulb,
  DollarSign,
  Users
} from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section - Fits in viewport */}
      <section className="relative min-h-[calc(100vh-56px)] sm:min-h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden px-4 sm:px-6 py-8">
        {/* Background Blobs - Hidden on mobile for performance */}
        <div className="hidden sm:block absolute top-0 -left-4 w-48 sm:w-72 h-48 sm:h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="hidden sm:block absolute top-0 -right-4 w-48 sm:w-72 h-48 sm:h-72 bg-violet-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="hidden sm:block absolute -bottom-8 left-20 w-48 sm:w-72 h-48 sm:h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="container relative z-10 mx-auto text-center space-y-4 sm:space-y-5 md:space-y-6 max-w-5xl">
          <div className="inline-flex items-center rounded-full border px-3 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 animate-fade-in-up">
            <Sparkles className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 text-indigo-500" />
            <span>AI-Powered Interview Coach</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground animate-fade-in-up leading-tight" style={{ animationDelay: '0.1s' }}>
            Practice Interviews. <br className="hidden sm:block" />
            <span className="text-gradient">Perfect Your Answers.</span> <br />
            <span className="text-indigo-600">Get Hired.</span>
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in-up px-2" style={{ animationDelay: '0.2s' }}>
            Upload your resume and job description — get a personalized interview experience with real-time AI questions, voice responses, and a detailed performance report.
          </p>
          
          <div className="flex justify-center pt-2 sm:pt-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/interview" className="w-full sm:w-auto max-w-xs sm:max-w-none">
              <Button size="lg" className="w-full sm:w-auto h-11 sm:h-12 md:h-14 px-6 sm:px-8 md:px-10 text-sm sm:text-base md:text-lg rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 bg-indigo-600 hover:bg-indigo-700">
                Start Your Mock Interview <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works - 3 Steps */}
      <section className="py-12 sm:py-16 md:py-24 bg-muted/30 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="text-center mb-8 sm:mb-12 md:mb-16 space-y-3 sm:space-y-4">
            <Badge variant="secondary" className="mb-2 sm:mb-4">Simple Process</Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">How It Works</h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto px-2">
              Three simple steps to ace your next interview
            </p>
          </div>

          <div className="relative">
            {/* Connecting Line (Desktop only) */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-indigo-200 via-violet-300 to-cyan-200 -translate-y-1/2 z-0 rounded-full"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative z-10">
              {/* Step 1 */}
              <div className="bg-background border-2 border-indigo-100 rounded-2xl p-6 sm:p-8 text-center shadow-lg hover:-translate-y-2 transition-all duration-300 group">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-br from-indigo-500 to-violet-500 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 text-white shadow-lg group-hover:scale-110 transition-transform">
                  <Upload className="h-8 w-8 sm:h-10 sm:w-10" />
                </div>
                <div className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold text-sm mb-3 sm:mb-4">1</div>
                <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3">Upload Your Resume & JD</h3>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  AI analyzes your skills and job requirements to create a personalized interview experience.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-background border-2 border-violet-100 rounded-2xl p-6 sm:p-8 text-center shadow-lg hover:-translate-y-2 transition-all duration-300 group">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-br from-violet-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 text-white shadow-lg group-hover:scale-110 transition-transform">
                  <Mic className="h-8 w-8 sm:h-10 sm:w-10" />
                </div>
                <div className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-violet-100 text-violet-600 font-bold text-sm mb-3 sm:mb-4">2</div>
                <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3">Attend an AI Interview</h3>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  Answer voice-based questions just like a real interview. Our AI adapts to your responses.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-background border-2 border-cyan-100 rounded-2xl p-6 sm:p-8 text-center shadow-lg hover:-translate-y-2 transition-all duration-300 group">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 text-white shadow-lg group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-8 w-8 sm:h-10 sm:w-10" />
                </div>
                <div className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-cyan-100 text-cyan-600 font-bold text-sm mb-3 sm:mb-4">3</div>
                <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3">Get Your Report</h3>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  Receive a detailed analysis of your performance with scores, feedback, and improvement suggestions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="text-center mb-8 sm:mb-12 md:mb-16 space-y-3 sm:space-y-4">
            <Badge variant="secondary" className="mb-2 sm:mb-4">Benefits</Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Why Choose MockLearn?</h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto px-2">
              Everything you need to succeed in your job interviews
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                icon: ShieldCheck,
                title: "Practice Without Pressure",
                desc: "Safe environment to practice and improve without the stress of real interviews.",
                color: "indigo"
              },
              {
                icon: Target,
                title: "Understand Recruiter Expectations",
                desc: "Learn what recruiters look for and tailor your answers accordingly.",
                color: "violet"
              },
              {
                icon: MessageSquare,
                title: "Improve Communication",
                desc: "Enhance your clarity, confidence, and articulation with AI feedback.",
                color: "cyan"
              },
              {
                icon: Lightbulb,
                title: "Identify Skill Gaps",
                desc: "Instantly discover areas where you need improvement.",
                color: "blue"
              },
              {
                icon: DollarSign,
                title: "Affordable & Accessible",
                desc: "Professional interview preparation at a fraction of traditional coaching costs.",
                color: "indigo"
              },
              {
                icon: Users,
                title: "For Everyone",
                desc: "Perfect for freshers, experienced professionals, and career switchers.",
                color: "violet"
              }
            ].map((item, i) => (
              <Card key={i} className="border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group overflow-hidden">
                <CardHeader className="pb-3 sm:pb-4">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-${item.color}-100 text-${item.color}-600 flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform`}>
                    <item.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <CardTitle className="text-base sm:text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Performance Analytics Preview */}
      <section className="py-12 sm:py-16 md:py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden relative px-4 sm:px-6">
        <div className="container mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="space-y-4 sm:space-y-6 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 text-indigo-400 font-medium">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm sm:text-base">Performance Analytics</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                Get a Comprehensive <span className="text-indigo-400">Performance Report</span>
              </h2>
              <p className="text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed">
                After the interview, receive a detailed breakdown of your Communication Score, Technical Accuracy, JD Match percentage, and actionable feedback for every answer.
              </p>
              <ul className="space-y-2 sm:space-y-3 text-left mx-auto md:mx-0 max-w-sm">
                {["Overall Score & Rating", "Communication Analysis", "Technical Accuracy", "JD Match Percentage", "Strengths & Weaknesses", "Improvement Suggestions"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 sm:gap-3 text-slate-300 text-sm sm:text-base">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-400 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Score Preview Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 sm:p-6 md:p-8 border border-white/20 shadow-2xl mx-auto w-full max-w-md">
              <div className="text-center mb-6 sm:mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 text-white text-3xl sm:text-4xl font-bold shadow-lg mb-3 sm:mb-4">
                  85
                </div>
                <p className="text-slate-300 text-xs sm:text-sm">Overall Score</p>
              </div>
              
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs sm:text-sm font-medium text-slate-300">Communication</span>
                    <span className="text-lg sm:text-xl font-bold text-white">92%</span>
                  </div>
                  <div className="h-2 sm:h-3 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-400 to-violet-400 w-[92%] rounded-full"></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs sm:text-sm font-medium text-slate-300">Technical Accuracy</span>
                    <span className="text-lg sm:text-xl font-bold text-white">78%</span>
                  </div>
                  <div className="h-2 sm:h-3 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-400 w-[78%] rounded-full"></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs sm:text-sm font-medium text-slate-300">JD Match</span>
                    <span className="text-lg sm:text-xl font-bold text-white">85%</span>
                  </div>
                  <div className="h-2 sm:h-3 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-violet-400 to-purple-400 w-[85%] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6">
        <div className="container mx-auto">
          <Card className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-none shadow-2xl overflow-hidden relative">
            <CardContent className="p-6 sm:p-8 md:p-12 lg:p-16 text-center space-y-4 sm:space-y-6 relative z-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Ready to Ace Your Next Interview?</h2>
              <p className="text-white/80 max-w-2xl mx-auto text-sm sm:text-base md:text-lg">
                Join thousands of candidates who are using AI to prepare smarter, not harder.
              </p>
              <Link to="/interview" className="inline-block">
                <Button size="lg" variant="secondary" className="h-12 sm:h-14 px-6 sm:px-10 text-base sm:text-lg rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 mt-2 sm:mt-4">
                  Start Free Mock Interview <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};
