import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

const mkdir = promisify(fs.mkdir);
const readdir = promisify(fs.readdir);
const unlink = promisify(fs.unlink);
const rmdir = promisify(fs.rmdir);
const stat = promisify(fs.stat);

// Konfiguracja multer dla uploadu plików
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const userId = (req as any).user.id;
      const folder = req.body.folder || '';
      const uploadPath = path.join(process.cwd(), 'uploads', userId, folder);
      
      // Sprawdź czy katalog istnieje, jeśli nie - utwórz go
      await mkdir(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (error) {
      cb(error as Error, '');
    }
  },
  filename: (req, file, cb) => {
    // Generuj unikalną nazwę pliku
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

// Filtr plików - tylko obrazy JPG i PNG
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Dozwolone są tylko pliki JPG i PNG'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// Upload pojedynczego pliku
export const uploadFile = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Nie wybrano pliku' });
    }

    const userId = (req as any).user.id;
    const folder = req.body.folder || '';
    const relativePath = path.join(userId, folder, req.file.filename);

    return res.status(200).json({
      message: 'Plik został przesłany pomyślnie',
      file: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        path: relativePath,
        url: `/api/files/${relativePath}`
      }
    });
  } catch (error) {
    console.error('Błąd uploadu pliku:', error);
    return res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Wystąpił błąd podczas uploadu pliku' 
    });
  }
};

// Pobierz listę plików w katalogu użytkownika
export const getFiles = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const folder = req.query.folder as string || '';
    const userPath = path.join(process.cwd(), 'uploads', userId, folder);

    // Sprawdź czy katalog istnieje
    try {
      await stat(userPath);
    } catch {
      return res.status(200).json({ files: [], folders: [] });
    }

    const items = await readdir(userPath, { withFileTypes: true });
    
    const files = [];
    const folders = [];

    for (const item of items) {
      if (item.isDirectory()) {
        folders.push({
          name: item.name,
          path: path.join(folder, item.name)
        });
      } else if (item.isFile()) {
        const filePath = path.join(userPath, item.name);
        const stats = await stat(filePath);
        const relativePath = path.join(userId, folder, item.name);
        
        files.push({
          name: item.name,
          size: stats.size,
          path: relativePath,
          url: `/api/files/${relativePath}`,
          createdAt: stats.birthtime
        });
      }
    }

    return res.status(200).json({ files, folders });
  } catch (error) {
    console.error('Błąd pobierania listy plików:', error);
    return res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Wystąpił błąd podczas pobierania listy plików' 
    });
  }
};

// Usuń plik
export const deleteFile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { filename } = req.params;
    const folder = req.query.folder as string || '';
    
    const filePath = path.join(process.cwd(), 'uploads', userId, folder, filename);
    
    // Sprawdź czy plik istnieje
    try {
      await stat(filePath);
    } catch {
      return res.status(404).json({ message: 'Plik nie został znaleziony' });
    }

    // Usuń plik
    await unlink(filePath);

    return res.status(200).json({ message: 'Plik został usunięty pomyślnie' });
  } catch (error) {
    console.error('Błąd usuwania pliku:', error);
    return res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Wystąpił błąd podczas usuwania pliku' 
    });
  }
};

// Utwórz folder
export const createFolder = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { folderName } = req.body;
    const parentFolder = req.body.parentFolder || '';
    
    if (!folderName) {
      return res.status(400).json({ message: 'Nazwa folderu jest wymagana' });
    }

    const folderPath = path.join(process.cwd(), 'uploads', userId, parentFolder, folderName);
    
    // Sprawdź czy folder już istnieje
    try {
      await stat(folderPath);
      return res.status(400).json({ message: 'Folder o tej nazwie już istnieje' });
    } catch {
      // Folder nie istnieje - można go utworzyć
    }

    await mkdir(folderPath, { recursive: true });

    return res.status(201).json({ 
      message: 'Folder został utworzony pomyślnie',
      folder: {
        name: folderName,
        path: path.join(parentFolder, folderName)
      }
    });
  } catch (error) {
    console.error('Błąd tworzenia folderu:', error);
    return res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Wystąpił błąd podczas tworzenia folderu' 
    });
  }
};

// Usuń folder
export const deleteFolder = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { folderName } = req.params;
    const parentFolder = req.query.parentFolder as string || '';
    
    const folderPath = path.join(process.cwd(), 'uploads', userId, parentFolder, folderName);
    
    // Sprawdź czy folder istnieje
    try {
      await stat(folderPath);
    } catch {
      return res.status(404).json({ message: 'Folder nie został znaleziony' });
    }

    // Sprawdź czy folder jest pusty
    const items = await readdir(folderPath);
    if (items.length > 0) {
      return res.status(400).json({ message: 'Folder nie jest pusty. Usuń najpierw wszystkie pliki i podfoldery.' });
    }

    // Usuń folder
    await rmdir(folderPath);

    return res.status(200).json({ message: 'Folder został usunięty pomyślnie' });
  } catch (error) {
    console.error('Błąd usuwania folderu:', error);
    return res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Wystąpił błąd podczas usuwania folderu' 
    });
  }
};

// Serwuj pliki statyczne
export const serveFile = async (req: Request, res: Response) => {
  try {
    const { userId, '*': filePath } = req.params;
    const fullPath = path.join(process.cwd(), 'uploads', userId, filePath);
    
    // Sprawdź czy plik istnieje
    try {
      await stat(fullPath);
    } catch {
      return res.status(404).json({ message: 'Plik nie został znaleziony' });
    }

    // Serwuj plik
    res.sendFile(fullPath);
  } catch (error) {
    console.error('Błąd serwowania pliku:', error);
    return res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Wystąpił błąd podczas pobierania pliku' 
    });
  }
};

