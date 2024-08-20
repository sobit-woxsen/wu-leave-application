import { Document } from "mongoose";

interface IStudentData extends Document {
  degree: string;
  admission: string;
  fullName: string;
  rollNumber: string;
  academicYear: string;
  sessionAcademicYear: string;
  program: string;
  semester: string;
  section: string;
  DOB: Date;
  gender: string;
  citizen: string;
  motherTongue: string;
  religion: string;
  smsPhoneNumber: number;
  studentEmail: string;
  country: string;
  fatherName: string;
  fatherMobileNumber: number;
  fatherEmail: string | null;
  motherName: string;
  motherMobileNumber: number | null;
  addmissionStatus: string;
}
interface IBBAStudent extends Document {
  degree: string;
  admission: string;
  fullName: string;
  rollNumber: string;
  academicYear: string;
  sessionAcademicYear: string;
  program: string;
  semester: string;
  section: string;
  DOB: Date;
  gender: string;
  citizen: string;
  motherTongue: string;
  religion: string;
  smsPhoneNumber: number;
  studentEmail: string;
  country: string;
  fatherName: string;
  fatherMobileNumber: number;
  fatherEmail: string | null;
  motherName: string;
  motherMobileNumber: number | null;
  addmissionStatus: string;
}

export type { IStudentData, IBBAStudent };
