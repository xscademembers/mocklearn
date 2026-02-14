import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, Badge } from '../components/UI';
import { FileText, ArrowLeft } from 'lucide-react';

export const Terms: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up py-6 sm:py-8 px-4 sm:px-6">
      {/* Back Link */}
      <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 sm:mb-8 transition-colors text-sm">
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      {/* Header */}
      <div className="mb-8 sm:mb-12">
        <Badge variant="secondary" className="mb-3 sm:mb-4">Legal</Badge>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2 sm:mb-4">Terms & Conditions</h1>
        <p className="text-muted-foreground text-sm sm:text-base">Last updated: January 2026</p>
      </div>

      {/* Content */}
      <Card className="shadow-sm">
        <CardContent className="p-5 sm:p-8 md:p-12 prose prose-slate max-w-none">
          <div className="space-y-6 sm:space-y-8">
            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
                <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600 flex-shrink-0" />
                1. Acceptance of Terms
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                By accessing and using MockLearn, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">2. Service Description</h2>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                MockLearn provides AI-based interview practice for educational purposes. Our platform analyzes your resume and job descriptions to generate personalized mock interview questions and provides feedback on your responses.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">3. No Guarantee of Employment</h2>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                <strong>We do not guarantee job placement or hiring outcomes.</strong> MockLearn is a practice and preparation tool. Your success in actual interviews depends on many factors beyond our platform, including your skills, experience, and the specific requirements of employers.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">4. User Responsibilities</h2>
              <ul className="list-disc pl-5 sm:pl-6 space-y-2 text-muted-foreground text-sm sm:text-base">
                <li>You must provide accurate information in your resume and job descriptions.</li>
                <li>You are responsible for maintaining the confidentiality of your account.</li>
                <li>You agree not to use the service for any unlawful purposes.</li>
                <li>You agree not to attempt to reverse engineer or exploit the platform.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">5. Data Usage</h2>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                Your uploaded data (resume, job descriptions, interview responses) is used only to generate interview questions and feedback. We process this data to provide you with personalized practice sessions. For more details, please refer to our{' '}
                <Link to="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</Link>.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">6. Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                All content, features, and functionality of MockLearn are owned by us and are protected by international copyright, trademark, and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">7. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                MockLearn shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">8. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                We reserve the right to modify these terms at any time. We will notify users of any significant changes via email or through the platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">9. Contact</h2>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                If you have any questions about these Terms & Conditions, please contact us at{' '}
                <a href="mailto:support@mocklearn.com" className="text-indigo-600 hover:underline break-all">
                  support@mocklearn.com
                </a>
              </p>
            </section>
          </div>
        </CardContent>
      </Card>

      {/* Agreement Notice */}
      <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-muted/50 rounded-xl text-center">
        <p className="text-muted-foreground text-xs sm:text-sm">
          By using our platform, you agree to our data usage and privacy policies.
        </p>
      </div>
    </div>
  );
};
