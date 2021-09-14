const express = require('express');
const multer = require('multer');
const path = require('path');
const pythonShell = require('python-shell');
const axios = require('axios');

const { Look, Temp } = require('../models');

const router = express.Router();

var storage = multer.diskStorage({
  //uplaod하면 서버에 저장하고 db에는 파일명만 저장
  destination: path.join(__dirname, "../public/uploads"),
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, path.basename(file.originalname, ext) + "-" + Date.now() + ext);
  },
});

var upload = multer({ storage: storage });

router.post("/get", upload.single("image"), async (req, res, next) => {
  const userId = req.body.userId;
  const kind = req.body.kind;
  const image = req.file.filename;
  const data = {
    userId,
    image,
    kind
  }
  try {
    await Temp.create(data);
    const dl_response = await axios.get("http://localhost:5000/model?filename=" + image + "&kind=" + kind)
    return res.send(dl_response.data);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.get("/read/:id", async (req, res, next) => {
  try {
    const look = await Temp.findOne({ where: { id: req.params.id } });
    if (look) {
      res.status(200).send(study);
    } else {
      res.status(404).send('no study');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
