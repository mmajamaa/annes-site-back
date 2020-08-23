const express = require("express");
const router = express.Router();

const galleryController = require("../controllers/gallery-controller.js");
const helpers = require("../controllers/helpers");

router
  .route("/")
  .get(galleryController.getGalleries)
  .post(helpers.verifyAdmin, galleryController.postGallery)
  .put(helpers.verifyAdmin, galleryController.putGalleries);

router
  .route("/:id")
  .delete(helpers.verifyAdmin, galleryController.deleteGallery);

router.route("/publish").post(helpers.verifyAdmin, galleryController.publish);

module.exports = router;
