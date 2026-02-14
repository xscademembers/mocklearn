import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Textarea, Badge } from '../components/UI';
import { Building2, Briefcase, MapPin, Mail, Phone, FileText, CheckCircle2, Send } from 'lucide-react';

export const ForCompanies: React.FC = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    jobTitle: '',
    location: '',
    jobType: '',
    experience: '',
    salaryRange: '',
    description: '',
    requirements: '',
    contactEmail: '',
    contactPhone: '',
    additionalInfo: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to submit job');
      }
      setIsSubmitted(true);
      setFormData({
        companyName: '',
        jobTitle: '',
        location: '',
        jobType: '',
        experience: '',
        salaryRange: '',
        description: '',
        requirements: '',
        contactEmail: '',
        contactPhone: '',
        additionalInfo: '',
      });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up py-6 sm:py-8 px-4 sm:px-6">
      <div className="text-center mb-8 sm:mb-12">
        <Badge variant="secondary" className="mb-2 sm:mb-4">For Companies</Badge>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 sm:mb-4">Post a Job</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Add your job details below. We'll use this to help candidates prepare and may surface it to our users.
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Job Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isSubmitted ? (
            <div className="py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Thank you!</h3>
              <p className="text-muted-foreground">Your job posting has been submitted successfully.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Company Name *</label>
                  <Input name="companyName" value={formData.companyName} onChange={handleChange} required placeholder="Acme Inc." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Job Title *</label>
                  <Input name="jobTitle" value={formData.jobTitle} onChange={handleChange} required placeholder="Senior Engineer" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <Input name="location" value={formData.location} onChange={handleChange} placeholder="Remote / City" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Job Type</label>
                  <Input name="jobType" value={formData.jobType} onChange={handleChange} placeholder="Full-time, Contract, etc." />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Experience</label>
                  <Input name="experience" value={formData.experience} onChange={handleChange} placeholder="e.g. 2-5 years" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Salary Range</label>
                  <Input name="salaryRange" value={formData.salaryRange} onChange={handleChange} placeholder="Optional" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Job Description *</label>
                <Textarea name="description" value={formData.description} onChange={handleChange} required rows={5} placeholder="Full job description..." className="resize-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Requirements</label>
                <Textarea name="requirements" value={formData.requirements} onChange={handleChange} rows={3} placeholder="Key requirements..." className="resize-none" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Contact Email</label>
                  <Input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} placeholder="hr@company.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Contact Phone</label>
                  <Input name="contactPhone" value={formData.contactPhone} onChange={handleChange} placeholder="Optional" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Additional Info</label>
                <Textarea name="additionalInfo" value={formData.additionalInfo} onChange={handleChange} rows={2} placeholder="Any other details..." className="resize-none" />
              </div>
              {submitError && <p className="text-sm text-destructive" role="alert">{submitError}</p>}
              <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                {isSubmitting ? 'Submitting...' : 'Submit Job'} <Send className="ml-2 h-4 w-4" />
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
