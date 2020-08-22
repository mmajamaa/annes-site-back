const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Image = require('./images');

let schema = new Schema({
  en: { type: String, require: true, unique: true }, // also used as a path
  fi: { type: String, require: true, unique: true },
  so: { type: Number, require: true },
  images: [{
    type: Schema.Types.ObjectId,
    ref: 'Image'
  }]
});

schema.pre('remove', async function (next) {
  try {
    const imageIds = this.images.map(image => image._id);

    // get gallery's images
    const images = await Image.find({
      "_id": {
        $in: imageIds
      }
    });

    // remove gallery's images
    for (let i = 0; i < images.length; i++) {
      await images[i].remove();
    }

    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = mongoose.model('Gallery', schema);
