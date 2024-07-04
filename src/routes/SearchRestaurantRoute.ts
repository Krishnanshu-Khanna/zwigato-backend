import express from "express";
import { param } from "express-validator";
import SearchRestaurantController from "../controllers/SearchRestaurantController";

const router = express.Router();

router.get(
	"/:restaurantId",
	param("restaurantId")
		.isString()
		.trim()
		.notEmpty()
		.withMessage("RestaurantId paramenter must be a valid string"),
	SearchRestaurantController.getRestaurant
);

router.get(
	"/search/:city",
	param("city")
		.isString()
		.trim()
		.notEmpty()
		.withMessage("City paramenter must be a valid string"),
	SearchRestaurantController.searchRestaurant
);

export default router;
