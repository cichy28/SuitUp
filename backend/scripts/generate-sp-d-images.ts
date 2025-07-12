import { createCanvas } from "canvas";
import fs from "fs/promises";
import path from "path";

const IMAGE_WIDTH = 800;
const IMAGE_HEIGHT = 600;

async function generateImage(text: string, filePath: string) {
    const canvas = createCanvas(IMAGE_WIDTH, IMAGE_HEIGHT);
    const context = canvas.getContext("2d");

    context.fillStyle = "#f0f0f0";
    context.fillRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);

    context.font = "40px Arial";
    context.fillStyle = "#333333";
    context.textAlign = "center";
    context.textBaseline = "middle";

    context.fillText(text, IMAGE_WIDTH / 2, IMAGE_HEIGHT / 2);

    const buffer = canvas.toBuffer("image/jpeg", { quality: 0.9 });
    await fs.writeFile(filePath, buffer);
    console.log(`Generated image: ${filePath}`);
}

async function generateSPDImages() {
    const productPath = "C:/Users/JanCichosz/Downloads/suit-app/_do_importu/Lemanska/PRODUKTY/SP_D";
    const variantsPath = path.join(productPath, "WARIANTY");
    await fs.mkdir(variantsPath, { recursive: true });

    const skus = [
        "SP_D_G1_NG1",
        "SP_D_G1_NG2",
        "SP_D_G1_NG3",
        "SP_D_G1_NG4",
        "SP_D_G2_NG1",
        "SP_D_G2_NG2",
        "SP_D_G2_NG3",
        "SP_D_G2_NG4"
    ];

    for (const sku of skus) {
        await generateImage(`Lemanska - SP_D - ${sku}`, path.join(variantsPath, `${sku}.jpg`));
    }
}

generateSPDImages();
