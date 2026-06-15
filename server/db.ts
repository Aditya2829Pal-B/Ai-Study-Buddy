import fs from "fs";
import path from "path";
import { z } from "zod";

const dbPath = path.join(process.cwd(), "db.json");

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  passwordHash: z.string().optional(), // optional if OAuth
  name: z.string().optional(),
  authProvider: z.enum(["local", "google", "github"]).default("local"),
  createdAt: z.string(),
  isPremium: z.boolean().default(false),
  stripeCustomerId: z.string().optional(),
  stripeSubscriptionId: z.string().optional()
});
export type User = z.infer<typeof UserSchema>;

export interface Database {
  users: User[];
}

export function readDb(): Database {
  try {
    if (!fs.existsSync(dbPath)) {
      writeDb({ users: [] });
    }
    const data = fs.readFileSync(dbPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("DB Read Error:", error);
    return { users: [] };
  }
}

export function writeDb(db: Database) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  } catch (error) {
    console.error("DB Write Error:", error);
  }
}
