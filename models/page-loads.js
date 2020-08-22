const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pageLoad = new Schema({
  domain: String,
  date: { type: Date, require: true }
});

module.exports = mongoose.model("page-load", pageLoad);
