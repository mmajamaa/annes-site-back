const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Image = require("./images");
const { deleteImages } = require("../services/images");

let schema = new Schema({
  en: { type: String, require: true, unique: true },
  fi: { type: String, require: true, unique: true },
  so: { type: Number, require: true },
  images: [
    {
      type: Schema.Types.ObjectId,
      ref: "Image",
    },
  ],
});

schema.pre("remove", async function (next) {
  try {
    const imageIds = this.images.map((image) => image._id);
    const images = await Image.find({ _id: imageIds });
    if (images.length > 0) {
      await Image.deleteMany({
        _id: imageIds,
      });
      const imgKeyObjs = images.map((img) => {
        return { Key: img.Key };
      });
      deleteImages(imgKeyObjs);
    }
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = mongoose.model("Gallery", schema);
