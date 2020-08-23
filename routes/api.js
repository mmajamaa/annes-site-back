const express = require("express");
const router = express.Router();

const imageRouter = require("./image-router");
const authRouter = require("./auth-router");
const galleryRouter = require("./gallery-router");

router.use("/images", imageRouter);

router.use("/auth", authRouter);

router.use("/galleries", galleryRouter);

module.exports = router;
