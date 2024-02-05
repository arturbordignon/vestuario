const express = require("express");
const router = express.Router();
const clothingController = require("../controllers/clothingController");

router.get("/user/clothes", clothingController.getAllClothing);

router.get("/user/:id", clothingController.getClothingById);

router.get("/user/season/:season", clothingController.getClothingBySeason);

module.exports = router;
