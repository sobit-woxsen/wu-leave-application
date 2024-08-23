import mongoose, { Schema } from "mongoose";

const leaveApplicationSchema = new Schema(
  {
    studentEmail: {
      type: String,
      required: true,
    },
    studentId: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    reasonForLeave: {
      type: String,
      required: true,
    },
    documentUrl: {
      type: String,
      nullable: true,
    },
    videoUrl: {
      type: String,
      nullable: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  }
);

const LeaveApplicationSchema = mongoose.model(
  "LeaveApplicationSchema",
  leaveApplicationSchema
);

export default LeaveApplicationSchema;
