const express = require('express');
const User = require('../models/user');
const Study = require('../models/study');
const Heart = require('../models/heart');

const router = express.Router();

router.post('/create', async (req, res, next) => {
  const { userId, studyId } = req.body;
  try {
    await Heart.create({
      user_id: userId,
      study_id: studyId
    });
    return res.status(200).send("success");
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.delete('/', async (req, res, next) => {
    const { userId, studyId } = req.body;
    console.log(req.body);
    try {
        await Heart.destroy({ where: {user_id: userId, study_id: studyId}});
        res.status(200).send("success");
    } catch (err) {
        console.error(err);
        next(err);
    }
});
router.get('/heartStudyAll/:userId', async (req, res, next) => {
    try {
        const heart = await Heart.findAll({ where: { user_id: req.params.userId } });
        const list = [];
        heart.forEach(a => {
            list.push(a.study_id);
        })
        if (heart) {
            const study = await Study.findAll({where: {id: list}})
        res.status(200).send(study);
        } else {
        res.status(404).send('no any heart');
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});
router.get('/heartStudyAllList/:userId', async (req, res, next) => {
    try {
        const heart = await Heart.findAll({ where: { user_id: req.params.userId } });
        const list = [];
        heart.forEach(a => {
            list.push(a.study_id);
        })
        if (heart) {
            const studyIdList = [];
            const study = await Study.findAll({where: {id: list}})
            study.map(a => {
                studyIdList.push(a.id)
            })
            res.status(200).send(studyIdList);
        } else {
        res.status(404).send('no any heart');
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;