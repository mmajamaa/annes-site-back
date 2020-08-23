const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

let schema = new Schema({
  username: { type: String, require: true },
  password: { type: String, require: true },
  admin: { type: Boolean, require: true, default: false },
});

schema.statics.hashPassword = function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
};

schema.methods.isValid = function (hashedpassword) {
  return bcrypt.compareSync(hashedpassword, this.password);
};

module.exports = mongoose.model("User", schema);
