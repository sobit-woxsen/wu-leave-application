// import { NextResponse } from "next/server";

// import bcom from "@/data/bcom.json";
// import bba from "@/data/bba.json";
// import dbConnect from "@/lib/db/db";
// import BCOMStudentData from "@/lib/db/models/bcomData.model";
// import BBAStudentData from "@/lib/db/models/bbaData.model";

// const seedData = async (model: any, data: any[]) => {
//   try {
//     await model.deleteMany({});
//     await model.insertMany(data);
//   } catch (error) {
//     console.error(`Error seeding data for ${model.modelName}:`, error);
//   }
// };

// export async function POST() {
//   try {
//     await dbConnect();
//     await seedData(BBAStudentData, bba);
//     await seedData(BCOMStudentData, bcom);
//     return NextResponse.json({ message: "Data seeded successfully" });
//   } catch (error) {
//     console.error("Error seeding data:", error);
//     return NextResponse.json({ error: "Failed to seed data" }, { status: 500 });
//   }
// }
