const fs = require("fs").promises;
const path = require("path");

const jwt = require("jsonwebtoken");
const aws = require("aws-sdk");

aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  region: "eu-north-1",
});

const s3 = new aws.S3();

module.exports = {
  verifyToken: (req, res, next) => {
    let token = req.query.token;
    jwt.verify(token, process.env.SECRET, (err, tokendata) => {
      if (err) {
        return res.status(400).json({ message: "Unauthorized request" });
      }
      if (tokendata) {
        next();
      }
    });
  },

  verifyAdmin: (req, res, next) => {
    let token = req.query.token;
    jwt.verify(token, process.env.SECRET, (err, tokendata) => {
      if (err || !tokendata.admin) {
        return res.status(400).json({ message: "Unauthorized request" });
      }
      next();
    });
  },

  uploadSubGalleryJson: async (subGalleryData) => {
    const bucket = process.env.BUCKET;
    const key = "sub_gallery_data.json";

    const params = {
      Bucket: bucket,
      Key: key,
      Body: JSON.stringify(subGalleryData),
      ContentType: "application/json",
      ACL: "public-read"
    };

    try {
      if (process.env.NODE_ENV === "production") {
        await s3.putObject(params).promise();
      } else {
        await fs.writeFile(path.join("public", key), JSON.stringify(subGalleryData))
      }
      console.log("Succesfully uploaded the sub gallery JSON.");
    } catch (error) {
      console.log(error);
    }
  },
};
