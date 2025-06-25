import { Router } from "express";
import { getRecommendations } from "../controllers/recommendationsController";
import validateRequest from "../middleware/validateRequest";
import { z } from "zod";
import { BodyShape, StylePreference } from "../../../shared/enums";

const router = Router();

// Schemat walidacji dla danych wejściowych (query params)
const CommaSeparatedStringToArray = z.string().transform((s) => s.split(",").filter(Boolean));

const RecommendationQuerySchema = z.object({
	bodyShape: BodyShape,
	styles: z
		.union([CommaSeparatedStringToArray, z.array(z.string())])
		.pipe(z.array(StylePreference).nonempty("At least one style must be provided")),
});

router.get("/", validateRequest(z.object({ query: RecommendationQuerySchema })), getRecommendations);

export { router };
