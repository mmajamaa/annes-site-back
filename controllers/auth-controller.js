const jwt = require("jsonwebtoken");

const helpers = require("./helpers");
const User = require("../models/users");

module.exports = {
  login: async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    console.log("login");

    try {
      let doc = await User.findOne({ username }).exec();
      if (doc) {
        if (doc.isValid(password)) {
          // generate token
          let token = jwt.sign(
            { username, admin: doc.admin },
            process.env.SECRET,
            {
              expiresIn: "3d",
            }
          );
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
    try {
      let user = new User({
        username: req.body.username,
        password: User.hashPassword(req.body.password),
      });
      let doc = await user.save();
      return res.status(201).json(doc);
    } catch (error) {
      return res.status(501).json({ message: "Error registering user." });
    }
  },

  authenticated: async (req, res, next) => {
    return res.status(200).json({ message: "User is authenticated." });
  },
};
