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
                console.log("--- [1/2] Resetting database ---");
                // The --workspace flag is needed if you run this from the root,
                // but since the backend service runs within its own context, it might not be.
                // However, npx should handle finding the prisma executable.
                const { stdout, stderr } = await execPromise("npx prisma migrate reset --force", { env: process.env });
                console.log("Prisma reset stdout:", stdout);
                if (stderr) {
                    console.error("Prisma reset stderr:", stderr);
                }
                console.log("--- Database reset complete ---");

                console.log("--- [2/2] Starting Mass Import ---");
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
