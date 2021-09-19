const express = require("express");
const multer = require("multer");
const path = require("path");
const axios = require("axios");

const { Look } = require("../models");

const router = express.Router();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    var regex = /[^0-9]/gi;
    file.originalname = file.originalname.replace(regex, "");
    if (file.originalname === "") {
      file.originalname = "a";
    }
    console.log(file);
    let date = new Date(Date.now()).toISOString().slice(0, 10);
    cb(null, `${date}_${file.fieldname}_${file.originalname}.jpg`);
  },
});

var upload = multer({ storage: storage }).fields([
  { name: "top", maxCount: 1 },
  { name: "bottom", maxCount: 1 },
  { name: "outer", maxCount: 1 },
  { name: "op", maxCount: 1 },
]);

// 이미지 업로드
router.post("/post/:id", upload, async (req, res, next) => {
  let result = {};
  for (let i in req.files) {
    try {
      const dl_response = await axios.get(
        "http://localhost:5000/model?filename=" +
          req.files[i][0].filename +
          "&kind=" +
          i
      );
      let db_data = {};
      if (i == "op") {
        db_data = {
          image: req.files[i][0].filename,
          kind: i,
          style: dl_response.data[0],
          top_len: dl_response.data[1],
          bottom_len: dl_response.data[2],
          userId: req.params.id,
        };
      } else {
        db_data = {
          image: req.files[i][0].filename,
          kind: i,
          style: dl_response.data[0],
          len: dl_response.data[1],
          userId: req.params.id,
        };
      }
      await Look.create(db_data);
      result[i] = dl_response.data;
    } catch (error) {
      console.error(error);
      return next(error);
    }
  }
  console.log(result);
  res.status(200).send(result);
});

router.get("/read/:id", async (req, res, next) => {
  try {
    const look = await Look.findOne({ where: { id: req.params.id } });
    if (look) {
      res.status(200).send(study);
    } else {
      res.status(404).send("no study");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
