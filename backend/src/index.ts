import express from "express";
import dotenv from "dotenv";
import cors from "cors";
// The PrismaClient import might not be directly used here in index.ts,
// but is good practice to show it's part of the project dependencies.
// import { PrismaClient } from '@prisma/client';

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

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
	origin: "*", // Pozwól na zapytania z każdego źródła. W produkcji ogranicz to do domeny frontendu.
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Jawnie zezwól na wszystkie popularne metody HTTP.
	preflightContinue: false,
	optionsSuccessStatus: 204, // Standardowa odpowiedź sukcesu dla zapytań preflight.
};
// Middleware
app.use(cors(corsOptions));
app.use(express.json()); // Parse JSON request bodies

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

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
