import mongoose, { Schema } from "mongoose";

const adminSchema = new Schema(
  {
    adminEmail: {
      type: String,
      required: true,
    },
    adminId: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "ADMIN",
    },
    department: {
      type: String,
      enum: ["BBA", "B.Com"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const AdminSchema = mongoose.model("AdminSchema", adminSchema);

export default AdminSchema;
