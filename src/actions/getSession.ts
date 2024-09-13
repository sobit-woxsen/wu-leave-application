"use server";

export async function getSession() {
  const response = await fetch(`/api/student/checkauth`);

  const { session } = await response.json();
  return session;
}
