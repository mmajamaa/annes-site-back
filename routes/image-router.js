const express = require("express");
const router = express.Router();

const imageController = require("../controllers/image-controller.js");
const helpers = require("../controllers/helpers");
const singleUpload = require("../services/images").singleUpload;

router
  .route("/")
  .get(imageController.getImages)
  .put(helpers.verifyToken, imageController.putImages);

router
  .route("/:galleryId")
  .post(helpers.verifyToken, singleUpload, imageController.postImage);

router.route("/:id").delete(helpers.verifyToken, imageController.deleteImage);

module.exports = router;
