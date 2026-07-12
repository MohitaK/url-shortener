import { PrismaClient } from "../generated/prisma/client.ts";

// Single shared instance: reused across every import so we don't open a
// new DB connection pool per file that needs the client.
export const prisma = new PrismaClient();
