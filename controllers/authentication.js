const jwt = require("jsonwebtoken");

const helpers = require("./helpers");
const User = require("../models/users");

module.exports = {
  index: async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    let doc = await User.findOne({ username }).exec();

    console.log("login");

    try {
      if (doc) {
        if (doc.isValid(password)) {
          // generate token
          let token = jwt.sign({ username }, process.env.SECRET, {
            expiresIn: "3d",
          });
          console.log("succesful login");
          return res.status(200).json({ username, token });
        } else {
          console.log("invalid pw");
          return res.status(501).json({ message: "Invalid password." });
        }
      } else {
        console.log("wrong username");
        return res.status(501).json({ message: "Wrong username." });
      }
    } catch (error) {
      res.status(501).json({ message: "Some internal error" });
    }
  },

  register: async (req, res, next) => {
    // TODO: REMOVE AS NEEDED
    return;
    let user = new User({
      username: req.body.username,
      password: User.hashPassword(req.body.password),
    });

    let doc = await user.save();

    try {
      return res.status(201).json(doc);
    } catch (error) {
      return res.status(501).json({ message: "Error registering user." });
    }
  },

  authenticated: async (req, res, next) => {
    return res.status(200).json({ message: "User is authenticated." });
  },
};
