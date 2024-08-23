import dbConnect from "@/lib/db/db";
import BBAStudentData from "@/lib/db/models/bbaData.model";
import BCOMStudentData from "@/lib/db/models/bcomData.model";
import { NextRequest, NextResponse } from "next/server";

const getStudentsData = async (model: any) => {
  try {
    const data = await model.find({});
    return data;
  } catch (error) {
    throw new Error("Failed to get student data");
  }
};

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    await dbConnect();

    const searchParams = req.nextUrl.searchParams;
    const department = searchParams.get("department");
    let students;

    console.log("DEPA", department);

    if (department === "BBA") {
      students = await getStudentsData(BBAStudentData);
    } else if (department === "BCOM") {
      students = await getStudentsData(BCOMStudentData);
    } else {
      return NextResponse.json(
        { message: "Invalid department specified" },
        { status: 400 }
      );
    }

    if (!students || students.length === 0) {
      return NextResponse.json(
        { message: "No student data found" },
        { status: 404 }
      );
    }

    // const body = await req.json();
    // console.log(body);

    // const students = await BBAStudentData?.find({});
    console.log("STUDENTS ", students);
    return NextResponse.json({
      message: "Data fetched successfully",
      data: students,
    });
  } catch (error) {
    return NextResponse.json({
      message: "Failed to get data",
      error: error,
    });
  }
}

// API to get the students data
