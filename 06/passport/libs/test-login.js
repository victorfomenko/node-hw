
// after koa-session!!!
exports.init = app => app.use(async (ctx, next) => {
  if (process.env.USE_TEST_USER) {
    ctx.session.passport.user = 'admin_user';
  }

  next();
});
