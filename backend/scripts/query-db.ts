import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";
import path from "path";

// Load environment variables from .env.development
dotenv.config({ path: '.env.development' });

const prisma = new PrismaClient();

async function executeQuery(query: string) {
  try {
    console.log(`Executing query: ${query}`);
    const result = await prisma.$queryRawUnsafe(query);
    console.log("Query Result:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Error executing query:", error);
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  const queryFilePath = path.join(__dirname, "query.sql");
  try {
    const query = await fs.readFile(queryFilePath, "utf-8");
    await executeQuery(query);
  } catch (error) {
    console.error(`Error reading query file ${queryFilePath}:`, error);
    console.log("Usage: Create a file named 'query.sql' in the 'backend/scripts/' directory with your SQL query.");
    console.log("Then run: npx cross-env ts-node scripts/query-db.ts");
  }
}

main();
