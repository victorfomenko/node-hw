const passport = require('koa-passport');
const User = require('../../models/user');

require('./serialize');

passport.use(require('./localStrategy'));
passport.use(require('./vkontakteStrategy'));

module.exports = passport;
