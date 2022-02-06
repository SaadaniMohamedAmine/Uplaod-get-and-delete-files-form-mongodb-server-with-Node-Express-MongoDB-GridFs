const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const url = "mongodb://127.0.0.1/images";
const Grid = require("gridfs-stream");
const upload = require("../middleware/upload");
const methodOverride = require("method-override");
const cors = require("cors");
const connect = mongoose.createConnection(url);

//init gfs
var gfs;

connect.once("open", () => {
  //init streams
  gridfsBucket = new mongoose.mongo.GridFSBucket(connect.db, {
    bucketName: "photos",
  });
  gfs = Grid(connect.db, mongoose.mongo);
  gfs.collection("photos");
});

//test route
router.get("/test", (req, res) => {
  res.json({ msg: "Test message from the server" });
});

// //routes to get data into ejs
// router.get("/", (req, res) => {
//   gfs.files.find().toArray((err, files) => {
//     if (!files || files.length === 0) {
//       res.render("index", { files: false });
//     } else {
//       files.map((file) => {
//         if (
//           file.contentType === "image/jpeg" ||
//           file.contentType === "image/png"
//         ) {
//           file.isImage = true;
//         } else {
//           file.isImage = false;
//         }
//       });
//       res.render("index", { files: files });
//     }
//   });
// });

//upload an image
router.post("/upload", upload.single("file"), (req, res) => {
  res.redirect("/");
});

//route to get files --display all files in json format
router.get("/files", (req, res) => {
  gfs.files.find().toArray((err, files) => {
    if (!files) {
      return res.status(404).json({ err: "No files there !!" });
    }
    res.json(files);
  });
});

//route to get one file
router.get("/files/:filename", (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file) {
      return res.status(404).json({ err: "No files there !!" });
    }
    res.json(file);
  });
});

//route to get and display an image
router.get("/images/:filename", (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file) {
      return res.status(404).json({ err: "No files there !!" });
    }
    //check if an image here
    if (file.contentType === "image/jpeg" || file.contentType === "image/png") {
      //react output to browser
      const readStream = gridfsBucket.openDownloadStream(file._id);
      readStream.pipe(res);
    } else {
      res.status(404).json({
        err: "Not an image there !!",
      });
    }
  });
});

//routes to delete the image
router.delete("/files/:filename", async (req, res) => {
  try {
    await gfs.files.deleteOne({ filename: req.params.filename });
    // res.json({ msg: "File deleted successfully !" });
    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.send("An error occured.");
  }
});

module.exports = router;
