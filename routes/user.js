const express = require('express');
const User = require('../models/user');

const router = express.Router();

// 로그인한 유저 정보 받아오기
router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.params.id } });
    if (user) {
      res.status(200).send(user);
    } else {
      res.status(404).send('no user');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 로그인한 유저 정보 수정
router.route('/:id')
  .patch(async (req, res, next) => {
    try {
      const result = await User.update({
        info : req.body.info,
        major : req.body.major,
        github : req.body.github,
        img : req.body.img
      }, {
        where: { id: req.params.id },
      });
      res.json(result);
    } catch (err) {
      console.error(err);
      next(err);
    }
  })

  //유저 삭제
  .delete(async (req, res, next) => {
    try {
      const result = await User.destroy({ where: { id: req.params.id } });
      res.json(result);
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

module.exports = router;
