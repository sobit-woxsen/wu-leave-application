import { PrismaClient } from "@prisma/client";
import bcomData from "../src/data/bcom.json";
import bbaData from "../src/data/bba.json";

const prisma = new PrismaClient();

async function main() {
  await prisma.bBAStudentData.deleteMany();

  for (const student of bbaData) {
    const studentData = {
      degree: student.degree,
      admissionNumber: student.admissionNumber,
      rollNumber: student.rollNumber,
      academicYear: student.academicYear,
      sessionAcademicYear: student.sessionAcademicYear,
      program: student.program,
      semester: student.semester,
      section: student.section,
      fullName: student.fullName,
      DOB: new Date(student.DOB),
      gender: student.gender,
      motherTongue: student.motherTongue,
      religion: student.religion,
      smsPhoneNumber: student.smsPhoneNumber
        ? Number(student.smsPhoneNumber)
        : null,
      studentEmail: student.studentEmail,
      country: student.country,
      fatherName: student.fatherName,
      fatherMobileNumber: student.fatherMobileNumber
        ? Number(student.fatherMobileNumber)
        : null,
      fatherEmail: student.fatherEmail || null,
      motherName: student.motherName,
      motherMobileNumber: student.motherMobileNumber
        ? Number(student.motherMobileNumber)
        : null,
      admissionStatus: student.admissionStatus,
    };

    await prisma.bBAStudentData.create({
      data: studentData,
    });
  }

  console.log("Seed data inserted successfully");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
