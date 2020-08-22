const mongoose = require("mongoose");
const pageLoad = require("../models/page-loads");

module.exports = {
  pageLoad: async (req, res, next) => {
    try {
      const newPageLoad = new pageLoad({
        date: Date.now(),
        domain: req.body.domain ? req.body.domain : null
      });

      if (process.env.NODE_ENV !== "production") {
        return res.status(200).json({ message: "hi developer" });
      }

      await newPageLoad.save();

      return res.status(200).json({ message: "hi front-end" });
    } catch (error) {
      return res.status(501);
    }
  }
};
