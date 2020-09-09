const fs = require("fs").promises;
const path = require("path");

const aws = require("aws-sdk");

aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  region: "us-east-2",
});

const s3 = new aws.S3();

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
    if (process.env.NODE_ENV === "production") {
      await s3.putObject(params).promise();
    } else {
      await fs.writeFile(path.join("public", "images", key), buf)
    }

    console.log("succesfully uploaded the image!");

    res.locals.url = production
      ? `https://${bucket}.s3.eu-north-1.amazonaws.com/${key}` :
      `http://www.localhost:4201/images/${key}`;
      
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
    if (process.env.NODE_ENV === "production") {
      await s3
      .deleteObject({
        Bucket: process.env.BUCKET,
        Key: file,
      })
      .promise();
    } else {
      await fs.unlink(path.join("public", "images", file))
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteImages = async (files) => {
  try {
    if (process.env.NODE_ENV === "production") {
      s3.deleteObjects({
        Bucket: process.env.BUCKET,
        Delete: {
          Objects: files,
        },
      }).promise();
    } else {
      for (let i = 0; i < files.length; i++) {
        await fs.unlink(path.join("public", "images", files[i].Key))
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { deleteImage, deleteImages, singleUpload };
