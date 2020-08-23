const express = require("express");
const router = express.Router();

const galleryController = require("../controllers/gallery-controller.js");
const helpers = require("../controllers/helpers");

router
  .route("/")
  .get(galleryController.getGalleries)
  .post(helpers.verifyToken, galleryController.postGallery)
  .put(helpers.verifyToken, galleryController.putGalleries);

router
  .route("/:id")
  .delete(helpers.verifyToken, galleryController.deleteGallery);

module.exports = router;
