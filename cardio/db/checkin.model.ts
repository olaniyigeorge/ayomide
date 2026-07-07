import mongoose, { Schema, models, model } from "mongoose";

export interface ICheckIn {
  weight: number;
  waist: number;
  glute: number;
  note?: string;
  createdAt?: Date;
}

const CheckInSchema = new Schema<ICheckIn>(
  {
    weight: { type: Number, required: true },
    waist: { type: Number, required: true },
    glute: { type: Number, required: true },
    note: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

// Prevents "OverwriteModelError" during Next.js hot reload in dev.
export default (models.CheckIn as mongoose.Model<ICheckIn>) ||
  model<ICheckIn>("CheckIn", CheckInSchema);