import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export async function POST(request: NextRequest) {
  const { file, fileName } = await request.json();

  const s3Client = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_S3_REGION ?? undefined,
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID ?? "",
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY ?? "",
    },
  });

  try {
    // const sendRes = await s3Client.send(
    //   new PutObjectCommand({
    //     Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET,
    //     Key: fileName,
    //     Body: file,
    //     ACL: "public-read",
    //   })
    // );

    // const meta = sendRes.$metadata;
    // if (meta.httpStatusCode !== 200)
    //   throw new Error(
    //     `Error uploading file, with status: ${meta.httpStatusCode}`
    //   );

    // return `${process.env.NEXT_PUBLIC_BASE_URL}.s3.${process.env.NEXT_PUBLIC_AWS_S3_REGION}.amazonaws.com/${fileName}`;

    return NextResponse.json(
      {
        messgae: "File uploaded successfully",
        url: `${process.env.NEXT_PUBLIC_BASE_URL}.s3.${process.env.NEXT_PUBLIC_AWS_S3_REGION}.amazonaws.com/${fileName}`,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        messgae: "Failed  to upload file",
        url: "somethingurl.com",
      },
      { status: 404 }
    );
  }
}
