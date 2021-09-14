const express = require('express');
const User = require('../models/user');
const Study = require('../models/study');
const Comment = require('../models/comment');

const router = express.Router();

router.post('/create', async (req, res, next) => {
  const { comment, commenter, study, userNick } = req.body;
  try {
    await Comment.create({
      comment,
      commenter,
      study,
      userNick
    });
    return res.send("success");
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.get('/:studyId', async (req, res, next) => {
  try {
    const comment = await Comment.findAll({ 
        where: { study: req.params.studyId }, 
        order: [
            ['create_at', 'ASC']
        ]});
    if (comment) {
        res.status(200).send(comment);
    } else {
      res.status(404).send('no any comment');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;