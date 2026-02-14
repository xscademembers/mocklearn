import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    feedback: { type: String, required: true },
    overallScore: { type: Number, default: null },
    source: { type: String, default: 'interview_result' },
  },
  { timestamps: true }
);

export const Feedback = mongoose.model('Feedback', feedbackSchema);
