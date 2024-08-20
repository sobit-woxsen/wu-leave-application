import { IStudentData } from "@/types/models.type";
import mongoose, { Schema } from "mongoose";

const bbaStudentSchema = new Schema({
  degree: { type: String, required: true },
  admissionNumber: { type: String, required: true },
  fullName: { type: String, required: true },
  rollNumber: { type: String, required: true },
  academicYear: { type: String, required: true },
  sessionAcademicYear: { type: String, required: true },
  program: { type: String, required: true },
  semester: { type: String, required: true },
  section: { type: String, required: true },
  DOB: { type: Date, required: true },
  gender: { type: String, required: true },
  citizen: { type: String, required: false },
  motherTongue: { type: String, nullable: true },
  religion: { type: String, nullable: true },
  smsPhoneNumber: { type: Number, nullable: true },
  studentEmail: { type: String, required: true },
  country: { type: String, required: true },
  fatherName: { type: String, nullable: true },
  fatherMobileNumber: { type: Number, nullable: true },
  fatherEmail: { type: String, nullable: true },
  motherName: { type: String, nullable: true },
  motherMobileNumber: { type: Number, nullable: true },
  admissionStatus: { type: String, required: true },
});

const BBAStudentData = mongoose.model<IStudentData>(
  "BBAStudentData",
  bbaStudentSchema
);

export default BBAStudentData;
