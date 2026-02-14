import React, { useState } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Textarea, Badge } from '../components/UI';
import { Mail, Phone, Send, CheckCircle2, MessageSquare, Clock } from 'lucide-react';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackError, setFeedbackError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to send message');
      }
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
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
        body: JSON.stringify({ feedback: feedbackText.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to submit feedback');
      }
      setFeedbackSubmitted(true);
      setFeedbackText('');
      setTimeout(() => setFeedbackSubmitted(false), 3000);
    } catch (err) {
      setFeedbackError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in-up py-6 sm:py-8 px-4 sm:px-6">
      {/* Header */}
      <div className="mb-8 sm:mb-12 text-center">
        <Badge variant="secondary" className="mb-2 sm:mb-4">Contact Us</Badge>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 sm:mb-4">Get in Touch</h1>
        <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          Have questions? Need help? We're here to support you on your interview preparation journey.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12">
        {/* Info Section */}
        <div className="lg:col-span-5 space-y-4 sm:space-y-6 order-2 lg:order-1">
          {/* Contact Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4">
            <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-50 to-teal-50 border border-indigo-100 group hover:shadow-md transition-all">
              <div className="p-2 sm:p-3 bg-indigo-500 rounded-lg sm:rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
                <Mail className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-base sm:text-lg mb-1">Email Us</h3>
                <a href="mailto:support@mocklearn.com" className="text-indigo-600 hover:underline font-medium text-sm sm:text-base break-all">
                  support@mocklearn.com
                </a>
                <p className="text-muted-foreground text-xs sm:text-sm mt-1">For general inquiries and support</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-100 group hover:shadow-md transition-all">
              <div className="p-2 sm:p-3 bg-teal-500 rounded-lg sm:rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
                <Phone className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-base sm:text-lg mb-1">Call Us</h3>
                <p className="text-teal-600 font-medium text-sm sm:text-base">+91-XXXXXXXXXX</p>
                <p className="text-muted-foreground text-xs sm:text-sm mt-1">Mon-Fri, 9am-6pm IST</p>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-100 group hover:shadow-md transition-all sm:col-span-2 lg:col-span-1">
              <div className="p-2 sm:p-3 bg-cyan-500 rounded-lg sm:rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-base sm:text-lg mb-1">Response Time</h3>
                <p className="text-cyan-600 font-medium text-sm sm:text-base">Within 24 hours</p>
                <p className="text-muted-foreground text-xs sm:text-sm mt-1">We usually respond within a business day</p>
              </div>
            </div>
          </div>

          {/* Feedback form - saves to MongoDB, shows in Dashboard */}
          <Card className="border-2 border-indigo-200 bg-indigo-50/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-indigo-600" />
                Share Your Feedback
              </CardTitle>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Your feedback helps us improve MockLearn for everyone.
              </p>
            </CardHeader>
            <CardContent>
              {feedbackSubmitted ? (
                <div className="flex items-center gap-2 text-indigo-600 py-2">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  <p className="text-sm font-medium">Thank you! Your feedback has been submitted.</p>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="space-y-3">
                  <Textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Tell us what you think..."
                    className="min-h-[100px] resize-none text-sm bg-background"
                    required
                  />
                  {feedbackError && <p className="text-sm text-destructive" role="alert">{feedbackError}</p>}
                  <Button type="submit" disabled={feedbackSubmitting} size="sm" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700">
                    {feedbackSubmitting ? 'Sending...' : 'Submit Feedback'} <Send className="ml-1 h-4 w-4" />
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Form Section */}
        <div className="lg:col-span-7 order-1 lg:order-2">
          <Card className="shadow-xl border-muted">
            <CardHeader className="space-y-1 pb-4 sm:pb-6">
              <CardTitle className="text-xl sm:text-2xl">Send us a Message</CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Fill out the form below and we'll get back to you within 24 hours.
              </p>
            </CardHeader>
            <CardContent>
              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-3 sm:mb-4">
                    <CheckCircle2 className="h-7 w-7 sm:h-8 sm:w-8 text-indigo-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground text-sm">Thank you for reaching out. We'll get back to you soon.</p>
                </div>
              ) : (
                <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-xs sm:text-sm font-medium">Name <span className="text-red-500">*</span></label>
                    <Input 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name" 
                      className="bg-muted/30 h-10 sm:h-12 text-sm sm:text-base" 
                      required
                    />
                  </div>
                  
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-xs sm:text-sm font-medium">Email <span className="text-red-500">*</span></label>
                    <Input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com" 
                      className="bg-muted/30 h-10 sm:h-12 text-sm sm:text-base" 
                      required
                    />
                  </div>
                  
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-xs sm:text-sm font-medium">Subject <span className="text-red-500">*</span></label>
                    <Input 
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="What is this regarding?" 
                      className="bg-muted/30 h-10 sm:h-12 text-sm sm:text-base" 
                      required
                    />
                  </div>
                  
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-xs sm:text-sm font-medium">Message <span className="text-red-500">*</span></label>
                    <Textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="How can we help you?" 
                      className="min-h-[120px] sm:min-h-[150px] bg-muted/30 text-sm sm:text-base" 
                      required
                    />
                  </div>
                  
                  {submitError && (
                    <p className="text-sm text-destructive" role="alert">{submitError}</p>
                  )}
                  <Button type="submit" disabled={isSubmitting} className="w-full h-11 sm:h-12 text-sm sm:text-base bg-indigo-600 hover:bg-indigo-700">
                    {isSubmitting ? 'Sending...' : 'Send Message'} <Send className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
