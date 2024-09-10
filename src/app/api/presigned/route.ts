import { NextResponse, type NextRequest } from "next/server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
export async function GET(request: NextRequest) {
  const accessKeyId = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY;
  const s3BucketName = process.env.NEXT_PUBLIC_AWS_BUCKET;
  if (!accessKeyId || !secretAccessKey || !s3BucketName) {
    return new Response(null, { status: 500 });
  }
  const searchParams = request.nextUrl.searchParams;
  const fileName = searchParams.get("fileName");
  const contentType = searchParams.get("contentType");
  if (!fileName || !contentType) {
    return new Response(null, { status: 500 });
  }

  const client = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_S3_REGION,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
  const command = new PutObjectCommand({
    Bucket: s3BucketName,
    Key: fileName,
    ContentType: contentType,
  });
  const signedUrl = await getSignedUrl(client, command, { expiresIn: 3600 });
  if (signedUrl) return NextResponse.json({ signedUrl });
  return new Response(null, { status: 500 });
}
