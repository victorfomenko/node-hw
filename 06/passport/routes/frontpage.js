
let passport = require('koa-passport');

exports.get = async function(ctx, next) {
  await passport.authenticate('jwt', (error, user)=>{
    if (user) {
      ctx.body = ctx.render('welcome');
    } else {
      ctx.body = ctx.render('login');
    }
  })(ctx, next);
};
