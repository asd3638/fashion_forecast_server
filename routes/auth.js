const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const router = express.Router();

router.post('/join', async (req, res, next) => {
  const { email, password, nick } = req.body;
  try {
    const exUserEmail = await User.findOne({ where: { email } });
    const exUserNick = await User.findOne({ where: { nick } });
    if (exUserEmail) {
      return res.send("aee");
    }
    if (exUserNick) {
      return res.send("aen");
    }
    const hash = await bcrypt.hash(password, 12);
    await User.create({
      email,
      nick,
      password: hash,
    });
    return res.send("success");
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.send("fail");
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.send(200, user);
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});

router.get('/logout', (req, res) => {
  return res.send(200, "logout")
});

router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao', {
  failureRedirect: '/',
}), (req, res) => {
  res.redirect('/');
});

module.exports = router;
