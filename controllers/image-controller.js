const Image = require("../models/images");
const Gallery = require("../models/gallerys");
const helpers = require("./helpers/index");

module.exports = {
  getImages: async (req, res, next) => {
    try {
      let images = await Image.find().sort({ so: 0 }).populate("gallery");
      return res.status(200).json(images);
    } catch (error) {
      return res.status(501).json({ message: "Error getting images" });
    }
  },

  postImage: async (req, res, next) => {
    try {
      const image = await Image.findOne({ gallery: req.params.galleryId }).sort(
        "-so"
      );
      // create new image
      const newImage = new Image({
        Key: res.locals.key,
        url: res.locals.url,
        alt_fi: res.locals.alt_fi,
        alt_en: res.locals.alt_en,
        so: image ? image.so + 1 : 0,
      });
      // get gallery based on url parameter
      const gallery = await Gallery.findById(req.params.galleryId);
      // set new image's gallery
      newImage.gallery = gallery._id;
      await newImage.save();
      // push new image to gallery
      gallery.images.push(newImage._id);
      await gallery.save();
      res.status(201).json(newImage);
    } catch (error) {
      return res
        .status(501)
        .json({ message: "Error on saving record to database." });
    }
  },

  deleteImage: async (req, res, next) => {
    try {
      const image = await Image.findOne({ _id: req.params.id });
      await image.remove();
      return res.status(200).json(image);
    } catch (error) {
      return res.status(501).json({ message: "Error deleting image." });
    }
  },

  putImages: async (req, res, next) => {
    try {
      const images = req.body.images;
      for (let i = 0; i < images.length; i++) {
        let image = await Image.findById(images[i].id);
        for (let key in images[i].changes) {
          image[key] = images[i].changes[key];
        }
        await image.save()
      }
      return res.status(200).json({ message: "success" });
    } catch (error) {
      return res
        .status(501)
        .json({ message: "Error on saving record to database." });
    }
  },
};
