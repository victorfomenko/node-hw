// A "closer to real-life" app example
// using 3rd party middleware modules
// P.S. MWs calls be refactored in many files

// long stack trace (+clarify from co) if needed
if (process.env.TRACE) {
  require('./libs/trace');
}

const Koa = require('koa');
const app = new Koa();

const config = require('config');
const mongoose = require('./libs/mongoose');

const path = require('path');
const fs = require('fs');

const handlers = fs.readdirSync(path.join(__dirname, 'middlewares')).sort();

handlers.forEach(handler => require('./middlewares/' + handler).init(app));

// ---------------------------------------

// can be split into files too
const Router = require('koa-router');

const router = new Router();

router.get('/', require('./routes/frontpage').get);
router.post('/login', require('./routes/login').post);
router.get('/logout', require('./routes/logout').get);
// router.get('/', require('./routes/login').post);

function userHasRole(role) {
  return async (ctx, next) => {
    if (ctx.req.user && ctx.req.user.role === role) return next();

    ctx.throw(403);
  };
}

router.get('/private', userHasRole('admin'), async (ctx, next) => {
  ctx.render('admin');
});

app.use(router.routes());

app.listen(3000);
