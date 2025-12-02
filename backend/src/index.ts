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
import adminRoutes from "./routes/admin"; // Import admin routes
import path from "path";

const app = express();
const port = parseInt(process.env.PORT || "3000", 10);

app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(morgan("dev"));

// Serwuj pliki statyczne
app.use("/api/uploads", express.static("/app/uploads"));

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
app.use("/api/admin", adminRoutes); // Dodaj admin router

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
