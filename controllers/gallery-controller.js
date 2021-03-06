const helpers = require("./helpers/index");
const Image = require("../models/images");
const Gallery = require("../models/gallerys");

module.exports = {
  getGalleries: async (req, res, next) => {
    try {
      let docs = await Gallery.find().sort({ so: 0 }).populate("images");
      return res.status(200).json(docs);
    } catch (error) {
      return res.status(501).json({ message: "Error getting gallerys." });
    }
  },

  postGallery: async (req, res, next) => {
    try {
      const gallery = await Gallery.findOne().sort("-so");

      let newGallery = new Gallery({
        en: req.body.en,
        fi: req.body.fi,
        so: gallery ? gallery.so + 1 : 0,
      });

      let doc = await newGallery.save();
      return res.status(201).json(doc);
    } catch (error) {
      return res.status(501).json({ message: "Error creating gallery." });
    }
  },

  deleteGallery: async (req, res, next) => {
    try {
      const gallery = await Gallery.findOne({ _id: req.params.id });
      await gallery.remove();
      return res.status(200).json(gallery);
    } catch (error) {
      return res.status(501).json({ message: "Error deleting gallery." });
    }
  },

  putGalleries: async (req, res, next) => {
    try {
      for (let i = 0; i < req.body.subGalleries.length; i++) {
        let gallery = await Gallery.findById(req.body.subGalleries[i].id);
        for (let key in req.body.subGalleries[i].changes) {
          gallery[key] = req.body.subGalleries[i].changes[key];
        }
        await gallery.save();
      }
      return res.status(201).json();
    } catch (error) {
      return res.status(501).json({ message: "Error updating changes." });
    }
  },

  publish: async (req, res, next) => {
    try {
      const docs = await Gallery.find().sort({ so: 0 }).populate("images");
      await helpers.uploadSubGalleryJson(docs);
      return res.status(201).json({ message: "Sub gallery changes published" });
    } catch (error) {
      console.log(error);
      return res
        .status(501)
        .json({ message: "Error publishing sub gallery changes." });
    }
  },
};
