import { Router } from "express";
import { getRecommendations } from "../controllers/recommendationsController";
import validateRequest from "../middleware/validateRequest";
import { z } from "zod";
import { BodyShape, StylePreference } from "../../../shared/enums";

const router = Router();

// Schemat walidacji dla danych wejściowych (query params)
const RecommendationQuerySchema = z.object({
	bodyShape: BodyShape,
	styles: z.preprocess((val) => (typeof val === "string" ? val.split(",") : val), z.array(StylePreference)),
});

router.get("/", validateRequest(z.object({ query: RecommendationQuerySchema })), getRecommendations);

export { router };
