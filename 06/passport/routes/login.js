
const passport = require('koa-passport');
const jwt = require('jsonwebtoken');
const jwtsecret = require('config').secret;

exports.post = async(ctx, next) => {
  await passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/',
    failureFlash: true,
  }, (err, user) => {
    if (!user) {
      ctx.body = 'Ошибка авторизации';
      ctx.status = 401;
    } else {
      const token = jwt.sign({
        displayName: user.displayName,
        email: user.email,
      }, jwtsecret);
      ctx.cookies.set('jwt', token);
      ctx.redirect('/');
    }
  })(ctx, next);
};

