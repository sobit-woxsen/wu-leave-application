"use server";

import { getCurrentUser } from "./getCurrentUser";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function gets3SignedUrl() {
  const user = await getCurrentUser();

  if (!user?.userId) {
    return { failure: "Not Authenticated" };
  }

  const accessKeyId = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY;
  const s3BucketName = process.env.NEXT_PUBLIC_AWS_BUCKET;

  if (!accessKeyId || !secretAccessKey || !s3BucketName) {
    return new Response(null, { status: 500 });
  }

  const s3 = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_S3_REGION,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  const command = new PutObjectCommand({
    Bucket: s3BucketName,
    Key: `${user.userId}-${Date.now()}`,
    Metadata: {
      userId: user.userId,
    },
  });

  const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

  return { success: { signedUrl: signedUrl, url: signedUrl.split("?")[0] } };
}
