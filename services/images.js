const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

const helpers = require("../controllers/helpers");

aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS,
  accessKeyId: process.env.AWS_ACCESS_KEY,
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
    bucket: process.env.BUCKET,
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: "TESTING" });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
});

const singleUpload = async (req, res, next) => {
  const body = JSON.parse(req.body);

  buf = new Buffer(
    body.image.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );

  const key = Date.now().toString();
  let production = process.env.NODE_ENV === "production";
  let bucket = process.env.BUCKET;

  var params = {
    Bucket: bucket,
    Key: key,
    Body: buf,
    ContentEncoding: "base64",
    ContentType: "image/jpeg",
    ACL: production ? "public-read" : "",
  };

  try {
    const data = await s3.putObject(params).promise();

    console.log("succesfully uploaded the image!");

    res.locals.url = production
      ? `https://${bucket}.s3.eu-north-1.amazonaws.com/${key}`
      : helpers.signUrl(key);

    res.locals.key = key;
    res.locals.alt_fi = body.alt_fi;
    res.locals.alt_en = body.alt_en;
    next();
  } catch (error) {
    console.log(error);
    console.log("Error uploading the image.");
    next(error);
  }
};

const deleteImage = async (file) => {
  try {
    await s3
      .deleteObject({
        Bucket: process.env.BUCKET,
        Key: file,
      })
      .promise();
  } catch (error) {
    console.log(error);
  }
};

const deleteImages = async (files) => {
  try {
    s3.deleteObjects({
      Bucket: process.env.BUCKET,
      Delete: {
        Objects: files,
      },
    }).promise();
  } catch (error) {
    console.log(error);
  }
};

module.exports = { upload, deleteImage, deleteImages, singleUpload };
