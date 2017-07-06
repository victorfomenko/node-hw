let passport = require('koa-passport');
const JwtStrategy = require('passport-jwt').Strategy;
const jwtsecret = require('config').secret;
let User = require('../../models/user');


const cookieExtractor = function(req, ...args) {
    console.log(req.cookies.get('jwt'));
    let token = null;
    if (req && req.cookies) {
        token = req.cookies.get('jwt');
    }
    return token;
};

// Стратегия берёт поля из ctx.request.body
// Вызывает для них функцию
passport.use(new JwtStrategy({
    jwtFromRequest: cookieExtractor,
    secretOrKey: jwtsecret,
    // passReqToCallback: true // req for more complex cases
  },
  // Три возможных итога функции
  // done(null, user[, info]) ->
  //   strategy.success(user, info)
  // done(null, false[, info]) ->
  //   strategy.fail(info)
  // done(err) ->
  //   strategy.error(err)
  function(/*req, */payload, done) {
    User.findOne({ email: payload.email }, (err, user) => {
      if (err) {
        return done(err);
      }

      if (!user) {
        return done(null, false, { message: 'Нет такого пользователя.' });
      }

      return done(null, user);
    });
  }
));
