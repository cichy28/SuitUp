import { Router } from "express";
import multer from "multer";
import path from "path";

const router = Router();

const uploadPath = process.env.UPLOAD_PATH || path.join(__dirname, '..', '..', 'uploads');

// Konfiguracja multer do zapisywania plików na dysku
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, uploadPath); // Folder, gdzie będą zapisywane pliki
	},
	filename: function (req, file, cb) {
		// Unikalna nazwa pliku, np. timestamp + oryginalna nazwa
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
	},
});

const upload = multer({ storage: storage });

const UPLOADS_BASE_PATH = "/uploads/"; // Define a constant for the base path

// Endpoint do uploadu pojedynczego pliku
router.post("/", upload.single("productImage"), (req, res) => {
	if (!req.file) {
		return res.status(400).send("No file uploaded.");
	}
	// Zwróć względną ścieżkę do zapisanego pliku
	const relativeFileUrl = `${UPLOADS_BASE_PATH}${req.file.filename}`;
	res.status(200).json({ url: relativeFileUrl }); // Zwracamy względny URL
});

export { router as uploadRoutes };
