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

// Endpoint do uploadu pojedynczego pliku
router.post("/", upload.single("productImage"), (req, res) => {
	if (!req.file) {
		return res.status(400).send("No file uploaded.");
	}
	// Zwróć publiczny URL do zapisanego pliku
	const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
	res.status(200).json({ url: fileUrl });
});

export { router as uploadRoutes };
