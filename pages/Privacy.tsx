import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, Badge } from '../components/UI';
import { Shield, Lock, Database, Trash2, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const Privacy: React.FC = () => {
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
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2 sm:mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground text-sm sm:text-base">Last updated: January 2026</p>
      </div>

      {/* Key Points Summary */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-8 sm:mb-12">
        {[
          { icon: Database, title: "Data Collection", desc: "Only what's needed for interviews" },
          { icon: Lock, title: "Data Security", desc: "Stored securely within our system" },
          { icon: Shield, title: "No Third-Party Sharing", desc: "We never sell your data" },
          { icon: Trash2, title: "Data Deletion", desc: "Request deletion anytime" }
        ].map((item, i) => (
          <div key={i} className="flex flex-col sm:flex-row items-start gap-2 sm:gap-4 p-3 sm:p-4 bg-indigo-50 rounded-xl border border-indigo-100">
            <div className="p-1.5 sm:p-2 bg-indigo-100 rounded-lg text-indigo-600 flex-shrink-0">
              <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm sm:text-base">{item.title}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Content */}
      <Card className="shadow-sm">
        <CardContent className="p-5 sm:p-8 md:p-12 prose prose-slate max-w-none">
          <div className="space-y-6 sm:space-y-8">
            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600 flex-shrink-0" />
                1. Information We Collect
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">
                We collect the following information to provide you with personalized interview practice:
              </p>
              <ul className="space-y-2">
                {[
                  "Resume text and content",
                  "Job descriptions you provide",
                  "Interview responses (voice and text)",
                  "Basic account information (email, name)",
                  "Usage data for improving our service"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 sm:gap-3 text-muted-foreground text-sm sm:text-base">
                    <CheckCircle2 className="h-4 w-4 text-indigo-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">2. How We Use Your Data</h2>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                We collect resume text, job descriptions, and interview responses <strong>only to generate personalized interview practice</strong>. This data is used to:
              </p>
              <ul className="list-disc pl-5 sm:pl-6 space-y-2 text-muted-foreground mt-3 sm:mt-4 text-sm sm:text-base">
                <li>Generate relevant interview questions based on your profile</li>
                <li>Evaluate and provide feedback on your responses</li>
                <li>Create comprehensive performance reports</li>
                <li>Improve our AI models and service quality</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">3. Data Protection</h2>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                <strong>All data is stored securely within our system.</strong> We implement industry-standard security measures including:
              </p>
              <ul className="list-disc pl-5 sm:pl-6 space-y-2 text-muted-foreground mt-3 sm:mt-4 text-sm sm:text-base">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security audits</li>
                <li>Access controls and authentication</li>
                <li>Secure cloud infrastructure</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">4. Data Sharing</h2>
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 sm:p-6">
                <p className="text-foreground font-medium text-base sm:text-lg mb-2">
                  🔒 We do NOT sell or share your data with any third parties.
                </p>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Your personal information, resume content, and interview responses are never sold, rented, or shared with external parties for marketing or any other purposes.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">5. Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">
                You have the following rights regarding your data:
              </p>
              <ul className="space-y-2">
                {[
                  "Access: Request a copy of your personal data",
                  "Correction: Update or correct your information",
                  "Deletion: Request deletion of your data anytime",
                  "Portability: Export your data in a readable format",
                  "Objection: Object to certain data processing"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 sm:gap-3 text-muted-foreground text-sm sm:text-base">
                    <CheckCircle2 className="h-4 w-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">6. Data Deletion</h2>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                <strong>You may request deletion of your data anytime.</strong> To delete your account and all associated data, please contact us at{' '}
                <a href="mailto:support@mocklearn.com" className="text-indigo-600 hover:underline break-all">
                  support@mocklearn.com
                </a>
                . We will process your request within 30 days.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">7. Cookies</h2>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                We use essential cookies to ensure the proper functioning of our platform. These cookies are necessary for authentication and maintaining your session.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">8. Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">9. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                If you have any questions about this Privacy Policy, please contact us at{' '}
                <a href="mailto:support@mocklearn.com" className="text-indigo-600 hover:underline break-all">
                  support@mocklearn.com
                </a>
              </p>
            </section>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
