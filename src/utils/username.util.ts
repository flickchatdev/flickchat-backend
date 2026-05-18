import prisma from "../prisma/prisma.js";

export async function generateUniqueUsername(base: string): Promise<string> {
  const sanitized = base
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 24);

  const root = sanitized || "user";
  let candidate = root;
  let suffix = 0;

  while (await prisma.user.findUnique({ where: { username: candidate } })) {
    suffix += 1;
    candidate = `${root}_${suffix}`;
  }

  return candidate;
}
