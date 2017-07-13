let passport = require('koa-passport');
let LocalStrategy = require('passport-local');
const User = require('../../models/user');

// Стратегия берёт поля из req.body
// Вызывает для них функцию
passport.use(new LocalStrategy({
    usernameField: 'email', // 'username' by default
    passwordField: 'password',
    session: false
  },
  function(email, password, done) {
    User.findOne({ email }, function(err, user) {
      if (err) {
        return done(err);
      }

      if (!user || !user.checkPassword(password)) {
        // don't say whether the user exists
        return done(null, false, { message: 'Нет такого пользователя или пароль неверен.' });
      }

      return done(null, user);
    });
  }
));
