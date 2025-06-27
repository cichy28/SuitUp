import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// --- KONFIGURACJA ---
// 1. Folder, z którego skrypt ma importować zdjęcia (stwórz go w głównym folderze projektu)
const SOURCE_FOLDER = path.join(__dirname, "..", "..", "_do_importu");
// 2. Folder docelowy dla publicznych plików
const DESTINATION_FOLDER = path.join(__dirname, "..", "uploads");
// 3. Publiczny URL, pod którym dostępne są pliki z DESTINATION_FOLDER
const PUBLIC_URL_BASE = "http://localhost:3000/uploads";
// --------------------

const prisma = new PrismaClient();

async function processImages() {
	console.log(`🔍 Skanowanie folderu: ${SOURCE_FOLDER}`);

	try {
		// Upewnij się, że foldery istnieją
		await fs.mkdir(SOURCE_FOLDER, { recursive: true });
		await fs.mkdir(DESTINATION_FOLDER, { recursive: true });

		const files = await fs.readdir(SOURCE_FOLDER);
		const imageFiles = files.filter((file) => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));

		if (imageFiles.length === 0) {
			console.log("✅ Nie znaleziono żadnych nowych obrazków do importu.");
			return;
		}

		console.log(`⏳ Znaleziono ${imageFiles.length} obrazków. Rozpoczynam import...`);

		const mapping = [];

		for (const originalFilename of imageFiles) {
			const fileExtension = path.extname(originalFilename);
			const uniqueFilename = `${uuidv4()}${fileExtension}`;

			const sourcePath = path.join(SOURCE_FOLDER, originalFilename);
			const destinationPath = path.join(DESTINATION_FOLDER, uniqueFilename);

			// 1. Przenieś plik
			await fs.rename(sourcePath, destinationPath);

			// 2. Stwórz wpis w bazie danych
			const newMultimedia = await prisma.multimedia.create({
				data: {
					url: `${PUBLIC_URL_BASE}/${uniqueFilename}`,
					altText: originalFilename, // Zapisujemy oryginalną nazwę dla łatwej identyfikacji!
					fileType: fileExtension.replace(".", "").toUpperCase(),
					// ownerId - opcjonalnie, jeśli chcesz przypisać do jakiegoś użytkownika
				},
			});

			mapping.push({
				original: originalFilename,
				multimediaId: newMultimedia.id,
			});

			console.log(`  -> Przeniesiono i zapisano: ${originalFilename} jako ID: ${newMultimedia.id}`);
		}

		console.log("\n✅ Pomyślnie zaimportowano wszystkie obrazki!");
		console.log("---");
		console.log("📋 Poniżej mapowanie, które możesz wykorzystać do aktualizacji produktów:");
		console.table(mapping);
		console.log("---");
	} catch (error) {
		console.error("❌ Wystąpił błąd podczas importu:", error);
	} finally {
		await prisma.$disconnect();
	}
}

processImages();
