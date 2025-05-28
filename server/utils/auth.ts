import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

export function validateId(id: string): number | null {
  const parsed = parseInt(id, 10);
  if (isNaN(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
}