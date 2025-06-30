import { createCanvas } from 'canvas';
import fs from 'fs/promises';
import path from 'path';

// --- CONFIGURATION ---
const SOURCE_FOLDER = path.join(__dirname, "..", "..", "_do_importu", "Lemanska");
const IMAGE_WIDTH = 800;
const IMAGE_HEIGHT = 600;
const NUMBER_OF_PRODUCTS = 15; // Generate 15 new products
// --------------------

const bodyShapes = ["INVERTED_TRIANGLE", "HOURGLASS", "OVAL", "RECTANGLE", "TRIANGLE"];
const stylePreferences = ["FITTED_WEAR", "OVERSIZE_WEAR", "RETRO_SHAPES", "MASCULINE_SHAPES"];
const colors = ["RED", "BLUE", "GREEN", "BLACK", "WHITE"];
const sizes = ["S", "M", "L", "XL"];

async function generateImage(text: string, filePath: string) {
    const canvas = createCanvas(IMAGE_WIDTH, IMAGE_HEIGHT);
    const context = canvas.getContext('2d');

    // Fill the background
    context.fillStyle = '#f0f0f0';
    context.fillRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);

    // Set text properties
    context.font = '40px Arial';
    context.fillStyle = '#333333';
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    // Draw the text
    context.fillText(text, IMAGE_WIDTH / 2, IMAGE_HEIGHT / 2);

    // Save the image
    const buffer = canvas.toBuffer('image/jpeg', { quality: 0.9 });
    await fs.writeFile(filePath, buffer);
    console.log(`Generated image: ${filePath}`);
}

async function generateProducts() {
    console.log("--- Starting Product Generation Script ---");
    await fs.mkdir(SOURCE_FOLDER, { recursive: true });

    for (let i = 1; i <= NUMBER_OF_PRODUCTS; i++) {
        const productName = `PRODUCT_LEMANSKA_${String(i).padStart(2, '0')}`;
        const productPath = path.join(SOURCE_FOLDER, productName);

        await fs.mkdir(productPath, { recursive: true });
        console.log(`Created product folder: ${productPath}`);

        // Generate product_metadata.json
        const suitableFor = [bodyShapes[Math.floor(Math.random() * bodyShapes.length)], bodyShapes[Math.floor(Math.random() * bodyShapes.length)]].filter((value, index, self) => self.indexOf(value) === index);
        const style = [stylePreferences[Math.floor(Math.random() * stylePreferences.length)], stylePreferences[Math.floor(Math.random() * stylePreferences.length)]].filter((value, index, self) => self.indexOf(value) === index);
        const metadata = { suitableFor, style };
        await fs.writeFile(path.join(productPath, 'product_metadata.json'), JSON.stringify(metadata, null, 2));
        console.log(`Generated product_metadata.json for ${productName}`);

        // Create WARIANTY folder and generate SKUs
        const variantsPath = path.join(productPath, "WARIANTY");
        await fs.mkdir(variantsPath, { recursive: true });
        // Generate SKUs based on random color and size
        const selectedColor = colors[Math.floor(Math.random() * colors.length)];
        const selectedSize = sizes[Math.floor(Math.random() * sizes.length)];
        const skuName = `${productName}_${selectedColor}_${selectedSize}`;
        const skuImagePath = path.join(variantsPath, `${skuName}.jpg`);
        await generateImage(`Lemanska - ${productName} - ${selectedColor} ${selectedSize}`, skuImagePath);

        // Create WLASCIWOSCI folder and generate properties/variants
        const propertiesPath = path.join(productPath, "WLASCIWOSCI");
        await fs.mkdir(propertiesPath, { recursive: true });

        // Color property
        const colorPath = path.join(propertiesPath, "KOLOR");
        await fs.mkdir(colorPath, { recursive: true });
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        await generateImage(`Kolor: ${randomColor}`, path.join(colorPath, `${randomColor}.jpg`));

        // Size property
        const sizePath = path.join(propertiesPath, "ROZMIAR");
        await fs.mkdir(sizePath, { recursive: true });
        const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
        await generateImage(`Rozmiar: ${randomSize}`, path.join(sizePath, `${randomSize}.jpg`));
    }

    console.log("\n--- Product Generation Finished Successfully ---");
}

generateProducts();