import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, Badge, Button } from '../components/UI';
import { ChevronDown, ChevronUp, HelpCircle, ArrowRight } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "How does MockLearn work?",
    answer: "Upload your resume and job description. Our AI generates personalized interview questions based on both documents and evaluates your voice answers in real-time. After the interview, you receive a comprehensive report with scores, feedback, and improvement suggestions."
  },
  {
    question: "What type of jobs does it support?",
    answer: "MockLearn supports all roles — technical, non-technical, finance, HR, operations, marketing, and more. Our AI adapts to the job description you provide to generate relevant questions for any industry or position."
  },
  {
    question: "Can I repeat interviews?",
    answer: "Yes! You can take multiple mock interviews based on the same or different job descriptions. Each session generates new questions based on your inputs, so you can practice as many times as you need."
  },
  {
    question: "What does the report include?",
    answer: "The report includes your overall score, communication analysis, technical accuracy, JD match percentage, strengths and weaknesses, and detailed improvement suggestions for each answer you provided."
  },
  {
    question: "Is my data secure?",
    answer: "Yes, your data is stored securely. We only collect resume text, job descriptions, and interview responses to generate personalized practice sessions. We do not sell or share your data with third parties."
  },
  {
    question: "How accurate is the AI evaluation?",
    answer: "Our AI uses advanced language models to evaluate your responses based on relevance, clarity, completeness, and alignment with job requirements. While no AI is perfect, it provides valuable feedback that helps you improve."
  },
  {
    question: "Can I use text input instead of voice?",
    answer: "Yes! While we recommend voice answers for a more realistic interview experience, you can also type your responses if you prefer."
  },
  {
    question: "How long does an interview session take?",
    answer: "A typical mock interview consists of 10-15 questions and takes about 15-30 minutes, depending on the length of your answers. You control the pace of the interview."
  },
  {
    question: "Can I download my interview report?",
    answer: "Yes, you can download your complete interview report as a PDF for future reference and to track your progress over time."
  },
  {
    question: "Is MockLearn free to use?",
    answer: "We offer a free tier with basic features. For unlimited interviews and advanced features, we have affordable premium plans. Check our pricing page for details."
  }
];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up py-6 sm:py-8 px-4 sm:px-6">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12">
        <Badge variant="secondary" className="mb-2 sm:mb-4">FAQ</Badge>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 sm:mb-4">Frequently Asked Questions</h1>
        <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          Find answers to common questions about MockLearn
        </p>
      </div>

      {/* FAQ Items */}
      <div className="space-y-3 sm:space-y-4">
        {faqData.map((faq, index) => (
          <Card 
            key={index} 
            className={`overflow-hidden transition-all duration-300 cursor-pointer ${
              openIndex === index ? 'border-indigo-200 shadow-md' : 'hover:border-muted-foreground/30'
            }`}
            onClick={() => toggleFAQ(index)}
          >
            <CardContent className="p-0">
              <div className="flex items-start justify-between p-4 sm:p-6 gap-3">
                <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                  <div className={`p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${
                    openIndex === index ? 'bg-indigo-100 text-indigo-600' : 'bg-muted text-muted-foreground'
                  } transition-colors`}>
                    <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <h3 className="font-semibold text-sm sm:text-lg pr-2">{faq.question}</h3>
                </div>
                <div className={`p-1 rounded-full flex-shrink-0 transition-colors ${
                  openIndex === index ? 'bg-indigo-100 text-indigo-600' : 'bg-muted text-muted-foreground'
                }`}>
                  {openIndex === index ? (
                    <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </div>
              </div>
              
              <div className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="px-4 pb-4 sm:px-6 sm:pb-6 pl-12 sm:pl-16">
                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Still have questions */}
      <Card className="mt-8 sm:mt-12 bg-gradient-to-r from-indigo-50 to-teal-50 border-indigo-200">
        <CardContent className="p-5 sm:p-8 text-center">
          <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Still Have Questions?</h3>
          <p className="text-muted-foreground text-sm sm:text-base mb-4 sm:mb-6">
            Can't find what you're looking for? We're here to help!
          </p>
          <Link to="/contact">
            <Button className="bg-indigo-600 hover:bg-indigo-700 h-10 sm:h-11 px-5 sm:px-6">
              Contact Support <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};
