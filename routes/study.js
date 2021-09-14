const express = require('express');
const { User, Study } = require('../models');

const router = express.Router();

router.post('/', async (req, res, next) => {
  const data = req.body;
  console.log(data);
  try {
    await Study.create(data);
    return res.send("success");
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.get('/all/:userId', async (req, res, next) => {
  try {
      const userList = [];
      await (await User.findAll()).map(a => {
          if (a.id == req.params.userId) {
            return
          }
          userList.push(a.id);
      })
    const study = await Study.findAll({where: {
        writter: userList
    }});
    if (study) {
      res.status(200).send(study);
    } else {
      res.status(404).send('no any study');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const study = await Study.findOne({ where: { id: req.params.id } });
    if (study) {
      res.status(200).send(study);
    } else {
      res.status(404).send('no study');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/user/:id', async (req, res, next) => {
  try {
    const study = await Study.findAll({ where: { writter: req.params.id } });
    if (study) {
      res.status(200).send(study);
    } else {
      res.status(404).send('no study');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});


router.route('/:id')
    .patch(async (req, res, next) => {
        try{
            const result = await Study.update({
                title: req.body.title,
                content: req.body.content,
                category: req.body.category,
                heart: req.body.heart,
                deadLine: req.body.deadLine,
                startLine: req.body.startLine,
                people: req.body.people,
                wanted: req.body.wanted
            }, {
                where: {id: req.params.id},
            });
            res.send("success");
        }catch (err) {
            console.error(err);
            next(err);
        }
    })
    .delete(async (req, res, next) => {
        try {
            const result = await Study.destroy({ where: {id: req.params.id}});
            res.send("success");
        } catch (err) {
            console.error(err);
            next(err);
        }
    });

router.get('/:id/studies/:id', async (req, res, next) => {
    try {
        const studies = await Study.findAll({
            title: req.body.title,
            content: req.body.content,
            category: req.body.category,
            startLine: req.body.startLine,
            deadLine: req.body.deadLine,
            people: req.body.people,
            wanted: req.body.wanted,   
            writter: req.body.writter,
        });
          res.json(studies);
        }catch (err) {
          console.log(err);
          next(err);
        }
    }
)

router.get('/category/:category/:id', async (req, res, next) => {
    try {
      const userList = [];
      await (await User.findAll()).map(a => {
          if (a.id == req.params.id) {
            return
          }
          userList.push(a.id);
      })
    const study = await Study.findAll({where: {
        writter: userList,
        category: req.params.category
    }});
    if (study) {
      res.status(200).send(study);
    } else {
      res.status(404).send('no any study');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
})

module.exports = router;