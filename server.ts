if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

function requireHTTPS(req, res, next) {
  if (process.env.NODE_ENV !== "production") {
    return next();
  }

  // The 'x-forwarded-proto' check is for Heroku
  if (!req.secure && req.get("x-forwarded-proto") !== "https") {
    return res.redirect("https://" + req.get("host") + req.url);
  }
  next();
}

app.use(requireHTTPS);

app.use(express.json());
app.use(cors());

// routes
const apiRoutes = require("./routes/api");

// mongoose
const mongoose = require("mongoose");
let mongoDB = process.env.MONGODB_URI;
mongoose.connect(
  mongoDB,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Connected to DB.");
    }
  }
);

app.use(bodyParser.json({ limit: "200mb" }));
app.use(bodyParser.urlencoded({ limit: "200mb", extended: true }));
app.use(bodyParser.text({ limit: "200mb" }));

app.use("/api", apiRoutes);

app.use(express.static('public'));

app.listen(process.env.PORT || 4201);
