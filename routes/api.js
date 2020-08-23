const express = require("express");
const router = express.Router();

const StatisticsController = require("../controllers/statistics.js");

const imageRouter = require("./image-router");
const authRouter = require("./auth-router");
const galleryRouter = require("./gallery-router");

router.use("/images", imageRouter);

router.use("/auth", authRouter);

router.use("/galleries", galleryRouter);

router.route("/page-load").post(StatisticsController.pageLoad);

module.exports = router;
