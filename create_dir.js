const fs = require('fs').promises;
const path = require('path');

async function createDirectory() {
  const dirPath = 'C:/Users/JanCichosz/Downloads/suit-app/_do_importu/Lemanska/WLASCIWOSCI/ROZMIAR';
  try {
    await fs.mkdir(dirPath, { recursive: true });
    console.log(`Directory created: ${dirPath}`);
  } catch (error) {
    console.error(`Error creating directory: ${error}`);
  }
}

createDirectory();