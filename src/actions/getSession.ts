"use server";

export async function getSession() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/student/checkauth`
  );

  const { session } = await response.json();
  return session;
}
