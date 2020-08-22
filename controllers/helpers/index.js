const jwt = require("jsonwebtoken");
const cfsign = require("aws-cloudfront-sign");
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

  signUrl: (objKey) => {
    let url = `https://d25i4fwd261ujo.cloudfront.net/${objKey}`; // TODO: change to more dynamic;

    let signingParams = {
      keypairId: process.env.CF_KEY_PAIR_ID,
      privateKeyString: process.env.CF_PRIVATE_KEY,
      expireTime: 1755507545000,
    };

    var signedUrl = cfsign.getSignedUrl(url, signingParams);

    return signedUrl;
  },

  uploadSubGalleryJson: (subGalleryData) => {
    let bucket = process.env.BUCKET;
    let key = "sub_gallery_data.json";
    let production = process.env.NODE_ENV === "production";

    s3.putObject(
      {
        Bucket: bucket,
        Key: key,
        Body: JSON.stringify(subGalleryData),
        ContentType: "application/json",
        ACL: production ? "public-read" : "",
      },
      function (err, data) {
        console.log(JSON.stringify(err) + " " + JSON.stringify(data));
      }
    );
  },
};
