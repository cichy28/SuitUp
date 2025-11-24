import { Request, Response, NextFunction } from "express";

// This is a hardcoded token for the import process.
// In a real production scenario, this should be stored securely as an environment variable.
const IMPORT_TOKEN = process.env.IMPORT_TOKEN || "a1b2c3d4-e5f6-7890-1234-56789abcdef0";

export const verifyImportToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['x-import-token'];

    if (!token) {
        return res.status(401).json({ message: "Brak tokenu autoryzacyjnego." });
    }

    if (token !== IMPORT_TOKEN) {
        return res.status(403).json({ message: "Nieprawidłowy token autoryzacyjny." });
    }

    next();
};
