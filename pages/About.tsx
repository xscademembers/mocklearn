import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '../components/UI';
import { 
  Check, 
  Shield, 
  Users, 
  Zap, 
  FileText, 
  BrainCircuit, 
  Mic, 
  BarChart3, 
  Target,
  GraduationCap,
  Briefcase,
  ArrowRight,
  Heart,
  Lightbulb,
  Award
} from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-12 sm:space-y-16 md:space-y-20 animate-fade-in-up py-6 sm:py-8 px-4 sm:px-6">
      {/* Hero Section */}
      <div className="text-center space-y-4 sm:space-y-6">
        <Badge variant="secondary" className="mb-2 sm:mb-4">About Us</Badge>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
          About <span className="text-indigo-600">MockLearn</span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          MockLearn is an AI-driven mock interview platform designed to help job seekers practice interviews without stress. Instead of searching for interview partners or waiting for interview slots, MockLearn gives you instant, personalized interview sessions — created from your resume and the job description.
        </p>
      </div>

      {/* What We Offer */}
      <section>
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3 sm:mb-4">What We Offer</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Comprehensive AI-powered tools to help you succeed
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[
            {
              icon: FileText,
              title: "Resume-based Interview Questions",
              desc: "Questions tailored specifically to your experience and skills.",
              color: "indigo"
            },
            {
              icon: BrainCircuit,
              title: "AI-driven JD Analysis",
              desc: "Smart analysis of job descriptions to match requirements.",
              color: "violet"
            },
            {
              icon: Mic,
              title: "Voice Answer Evaluation",
              desc: "Speak naturally and get evaluated on communication skills.",
              color: "cyan"
            },
            {
              icon: BarChart3,
              title: "Detailed Performance Reports",
              desc: "Comprehensive feedback with scores and improvement areas.",
              color: "blue"
            },
            {
              icon: Target,
              title: "Role-specific Competency Feedback",
              desc: "Feedback aligned with the specific role requirements.",
              color: "indigo"
            },
            {
              icon: Briefcase,
              title: "Job Matching (Coming Soon)",
              desc: "We're building a tailored list of job openings that match your resume.",
              color: "violet"
            }
          ].map((item, i) => (
            <Card key={i} className="border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
              <CardHeader className="pb-3">
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
      </section>

      {/* Who Is This For */}
      <section className="bg-muted/30 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3 sm:mb-4">Who Is This For?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            MockLearn is designed for anyone preparing for their next opportunity
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {[
            {
              icon: GraduationCap,
              title: "Freshers",
              desc: "Students and recent graduates preparing for their first job",
              color: "indigo"
            },
            {
              icon: Briefcase,
              title: "Working Professionals",
              desc: "Employed individuals looking for better opportunities",
              color: "violet"
            },
            {
              icon: ArrowRight,
              title: "Job Switchers",
              desc: "People transitioning to new roles or industries",
              color: "cyan"
            },
            {
              icon: Award,
              title: "Campus Placement",
              desc: "Students preparing for campus placements and top offers",
              color: "blue"
            }
          ].map((item, i) => (
            <div key={i} className="bg-background rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center shadow-sm hover:shadow-md transition-all border">
              <div className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full bg-${item.color}-100 text-${item.color}-600 flex items-center justify-center mb-3 sm:mb-4`}>
                <item.icon className="h-6 w-6 sm:h-8 sm:w-8" />
              </div>
              <h3 className="font-semibold text-sm sm:text-lg mb-1 sm:mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-xs sm:text-sm hidden sm:block">{item.desc}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-muted-foreground mt-6 sm:mt-8 text-sm sm:text-lg">
          Perfect for <span className="font-semibold text-foreground">behavioural</span> or <span className="font-semibold text-foreground">technical</span> interviews across all domains!
        </p>
      </section>

      {/* Our Values */}
      <section>
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3 sm:mb-4">Our Values</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
          {[
            {
              icon: Heart,
              title: "Empowerment",
              desc: "We believe everyone deserves access to quality interview preparation, regardless of their background or budget.",
              color: "rose"
            },
            {
              icon: Lightbulb,
              title: "Innovation",
              desc: "We leverage cutting-edge AI technology to provide the most realistic and helpful mock interview experience.",
              color: "amber"
            },
            {
              icon: Users,
              title: "Accessibility",
              desc: "Our platform is designed to be affordable and accessible to students, job seekers, and professionals worldwide.",
              color: "indigo"
            }
          ].map((item, i) => (
            <Card key={i} className={`border-t-4 border-t-${item.color}-500 shadow-lg`}>
              <CardHeader className="pb-3">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-${item.color}-100 text-${item.color}-600 flex items-center justify-center mb-2 sm:mb-3`}>
                  <item.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <CardTitle className="text-lg sm:text-xl">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <Card className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-none shadow-xl">
        <CardContent className="p-6 sm:p-8 md:p-12 text-center space-y-4 sm:space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold">Ready to Master Your Interview Skills?</h2>
          <p className="text-white/80 max-w-2xl mx-auto text-sm sm:text-base">
            Join thousands of candidates who are using AI to prepare smarter, not harder.
          </p>
          <Link to="/interview">
            <Button size="lg" variant="secondary" className="h-11 sm:h-12 px-6 sm:px-8 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 mt-2 sm:mt-4">
              Start Free Mock Interview <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};
