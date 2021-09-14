const express = require('express');
const User = require('../models/user');
const Study = require('../models/study');

const router = express.Router();

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

router.get('/:id/studies', async (req, res, next) => {
  try {
    const studies = await Study.findAll({
      include: {
        model: User,
        where: { id: req.params.id },
      },
    });
    console.log(studies);
    res.json(studies);
  }catch (err) {
    console.log(err);
    next(err);
  }
})


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

  //삭제
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
