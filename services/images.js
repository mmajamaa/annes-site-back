const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

const helpers = require("../controllers/helpers");
let config = "";

if (process.env.NODE_ENV !== "production") {
  config = require("../config.json");
}
aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS || config.AWS_SECRET_ACCESS,
  accessKeyId: process.env.AWS_ACCESS_KEY || config.AWS_ACCESS_KEY,
  region: "us-east-2",
});

const s3 = new aws.S3();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Invalid Mime Type, only JPEG and PNG"), false);
  }
};

// not used right now, replaced with upload below to apply compression of images
const upload = multer({
  fileFilter,
  storage: multerS3({
    s3,
    bucket: "annes-gallery",
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: "TESTING" });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
});

const singleUpload = (req, res, next) => {
  const body = JSON.parse(req.body);

  buf = new Buffer(
    body.image.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );

  const key = Date.now().toString();
  let production = process.env.NODE_ENV === "production";
  let bucket = process.env.BUCKET || config.BUCKET;

  var data = {
    Bucket: bucket,
    Key: key,
    Body: buf,
    ContentEncoding: "base64",
    ContentType: "image/jpeg",
    ACL: production ? "public-read" : "",
  };
  s3.putObject(data, function (err, data) {
    if (err) {
      console.log(err);
      console.log("Error uploading data: ", data);
    } else {
      console.log("succesfully uploaded the image!");

      if (!production) {
        res.locals.url = helpers.signUrl(key);
      } else {
        res.locals.url = `https://${bucket}.s3.eu-north-1.amazonaws.com/${key}`; // TODO: change to more dynamic;
      }

      res.locals.key = key;
      res.locals.alt_fi = body.alt_fi;
      res.locals.alt_en = body.alt_en;
      next();
    }
  });
};

const deleteImage = (file) => {
  s3.deleteObject(
    {
      Bucket: "annes-gallery",
      Key: file,
    },
    (error, data) => {
      if (error) console.log(error, error.stack);
    }
  );
};

const deleteImages = (files) => {
  s3.deleteObjects(
    {
      Bucket: "annes-gallery",
      Delete: {
        Objects: files,
      },
    },
    function (error, data) {
      if (error) console.log(error, error.stack);
      else console.log("delete", data);
    }
  );
};

module.exports = { upload, deleteImage, deleteImages, singleUpload };
