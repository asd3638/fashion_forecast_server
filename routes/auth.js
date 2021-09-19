const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const router = express.Router();

router.post('/join', async (req, res, next) => {
  const { email, password, nickName } = req.body;
  try {
    const exUserEmail = await User.findOne({ where: { email } });
    const exUserNick = await User.findOne({ where: { nickName } });
    if (exUserEmail) {
      return res.send("dup_email");
    }
    if (exUserNick) {
      return res.send("dup_nickname");
    }
    // 중복되는 이메일이나 닉네임의 유저가 없으면
    const hash = await bcrypt.hash(password, 12);
    await User.create({
      email,
      nickName,
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

module.exports = router;
