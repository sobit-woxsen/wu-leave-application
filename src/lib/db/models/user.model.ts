import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    studentEmail: {
      type: String,
      required: true,
    },
    studentId: {
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
      default: "USER",
    },
    applications: [
      {
        type: Schema.Types.ObjectId,
        ref: "LeaveApplication",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const UserSchema = mongoose.model("UserSchema", userSchema);

export default UserSchema;
