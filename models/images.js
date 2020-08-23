const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const deleteImage = require("../services/images").deleteImage;

let schema = new Schema({
  Key: String,
  url: { type: String, require: true },
  alt_fi: { type: String, require: true },
  alt_en: { type: String, require: true },
  so: { type: Number, require: true },
  gallery: {
    type: Schema.Types.ObjectId,
    ref: "Gallery",
  },
});

schema.pre("remove", async function (next) {
  deleteImage(this.Key);
  next();
});

module.exports = mongoose.model("Image", schema);
