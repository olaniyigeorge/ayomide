import mongoose, { Schema, models, model } from "mongoose";

export interface ILead {
  name: string;
  phone: string;
  goals: string[];
  createdAt?: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    goals: {
      type: [String],
      required: true,
      validate: (v: string[]) => Array.isArray(v) && v.length > 0,
    },
  },
  { timestamps: true }
);

// Prevents "OverwriteModelError" during Next.js hot reload in dev.
export default (models.Lead as mongoose.Model<ILead>) ||
  model<ILead>("Lead", LeadSchema);