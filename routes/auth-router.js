const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth-controller.js");
const helpers = require("../controllers/helpers");

router.route("/login").post(authController.login);

router.route("/register").post(authController.register);

router.route("/status").get(helpers.verifyToken, authController.authenticated);

module.exports = router;
