import { Router } from "express";
import { exec } from "child_process";
import { promisify } from "util";
import { verifyImportToken } from "../middleware/auth";
import { runMassImport } from "../services/importService";

const router = Router();
const execPromise = promisify(exec);

router.post("/import-data", verifyImportToken, async (req, res) => {
    try {
        console.log("Received request to reset database and start mass import...");

        // Respond immediately to the client
        res.status(202).json({ message: "Proces resetowania bazy danych i importu rozpoczęty. Sprawdź logi serwera, aby śledzić postęp." });

        // Perform the reset and import in the background
        (async () => {
            try {
                console.log("--- [1/3] Resetting database ---");
                const { stdout: resetStdout, stderr: resetStderr } = await execPromise("npx prisma migrate reset --force", { env: process.env });
                console.log("Prisma reset stdout:", resetStdout);
                if (resetStderr) {
                    console.error("Prisma reset stderr:", resetStderr);
                }
                console.log("--- Database reset complete ---");

                console.log("--- [2/3] Applying migrations ---");
                // Using 'migrate dev' as it's consistent with other project scripts for development.
                const { stdout: migrateStdout, stderr: migrateStderr } = await execPromise("npx prisma migrate dev", { env: process.env });
                console.log("Prisma migrate stdout:", migrateStdout);
                if (migrateStderr) {
                    console.error("Prisma migrate stderr:", migrateStderr);
                }
                console.log("--- Migrations applied ---");

                console.log("--- [3/3] Starting Mass Import ---");
                await runMassImport();
                console.log("--- Mass import finished successfully ---");

            } catch (err) {
                console.error("--- Background reset and import process failed ---:", err);
            }
        })();

    } catch (error) {
        console.error("Error triggering mass import:", error);
        res.status(500).json({ message: "Nie udało się uruchomić procesu importu.", error: error });
    }
});

export default router;