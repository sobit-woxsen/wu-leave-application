import { gets3SignedUrl } from "./gets3SignedUrl.action";

export async function uploadFile(file: File) {
  const signedUrlResponse = await gets3SignedUrl();
  if ("failure" in signedUrlResponse) return;
  const signedUrl =
    "success" in signedUrlResponse
      ? signedUrlResponse.success.signedUrl
      : undefined;

  if (file && signedUrl) {
    await fetch(signedUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    return signedUrl.split("?")[0];
  }
}
