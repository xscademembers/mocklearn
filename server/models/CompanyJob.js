import mongoose from 'mongoose';

const companyJobSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    jobTitle: { type: String, required: true },
    location: { type: String, default: '' },
    jobType: { type: String, default: '' },
    experience: { type: String, default: '' },
    salaryRange: { type: String, default: '' },
    description: { type: String, required: true },
    requirements: { type: String, default: '' },
    contactEmail: { type: String, default: '' },
    contactPhone: { type: String, default: '' },
    additionalInfo: { type: String, default: '' },
  },
  { timestamps: true }
);

export const CompanyJob = mongoose.model('CompanyJob', companyJobSchema);
