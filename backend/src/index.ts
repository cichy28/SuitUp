import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
// The PrismaClient import might not be directly used here in index.ts,
// but is good practice to show it's part of the project dependencies.
// import { PrismaClient } from '@prisma/client';
import { uploadRoutes } from "./routes/upload";
import { router as customerRoutes } from "./routes/customers";
import { router as userRoutes } from "./routes/users";
import { router as productRoutes } from "./routes/products";
import { router as categoryRoutes } from "./routes/categories";
import { router as orderRoutes } from "./routes/orders";
import { router as multimediaRoutes } from "./routes/multimedia";
import { router as propertyRoutes } from "./routes/properties";
import { router as productSkuRoutes } from "./routes/productSkus";
import { router as propertyVariantRoutes } from "./routes/propertyVariants"; // Import propertyVariant routes
import { router as recommendationsRoutes } from "./routes/recommendations";
import path from "path"; // Upewnij się, że masz import path
if (process.env.NODE_ENV === "production") {
	dotenv.config({ path: ".env.production" });
} else {
	dotenv.config({ path: ".env.development" });
}

const app = express();
const port = parseInt(process.env.PORT || "3000", 10);

const corsOptions = {
	origin: "*", // Pozwól na zapytania z każdego źródła. W produkcji ogranicz to do domeny frontendu.
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Jawnie zezwól na wszystkie popularne metody HTTP.
	preflightContinue: false,
	optionsSuccessStatus: 204, // Standardowa odpowiedź sukcesu dla zapytań preflight.
};
// Middleware
app.use(cors(corsOptions));
app.use(express.json()); // Parse JSON request bodies

const uploadsPath = path.join(__dirname, '..', 'uploads');

// Dodatkowe logowanie dla żądań do /uploads
app.use("/uploads", (req, res, next) => {
  const requestedFilePath = path.join(uploadsPath, req.path);
  console.log(`[Uploads Static] Request for URL: ${req.originalUrl}, Attempting to serve from: ${requestedFilePath}`);
  next();
});
console.log(`Serving static files from: ${uploadsPath}`); // Dodaj tę linię
app.use("/uploads", express.static(uploadsPath)); // Serwuj pliki z folderu /uploads
app.use(morgan("dev"));
// Routes
app.use("/api/customers", customerRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/multimedia", multimediaRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/product-skus", productSkuRoutes);
app.use("/api/property-variants", propertyVariantRoutes);
app.use("/api/recommendations", recommendationsRoutes);
app.use("/api/upload", uploadRoutes); // Dodaj nowy router

// Simple root route
app.get("/", (req, res) => {
	res.send("Backend is running!");
});

// Error handling middleware (optional, but good practice)
// It's important that this middleware is defined last
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
	console.error(err.stack);
	res.status(500).send("Something broke!");
});

app.listen(port, "0.0.0.0", () => {
	console.log(`Server is running on port ${port}`);
});
