const User = require('../../models/user');
const VKontakteStrategy = require('passport-vkontakte').Strategy;
const authenticateByProfile = require('./authenticateByProfile');
const config = require('config');
const request = require('request-promise');

function UserAuthError(message) {
  this.message = message;
}
/*
  OAuth2,

  website -> facebook (clientID, clientSecret) -> website (code) (|)

      code -> request(code) -> access_token -> requestFacebookAPI(access_token) ->
      profile

  -> website (welcome)

*/
module.exports = new VKontakteStrategy({
    clientID:          config.providers.vkontakte.appId,
    clientSecret:      config.providers.vkontakte.appSecret,
    callbackURL:       config.server.siteHost + "/oauth/vkontakte",
    // fields are described here:
    // https://developers.facebook.com/docs/graph-api/reference/v2.7/user
    scope: ['email'],
    profileFields: ['email', 'city', 'bdate']
  }, async function(req, accessToken, refreshToken, profile, done) {

    try {
      console.log(profile);

      let permissionError = null;
      profile.emails = ['vf@mail.com']
      // facebook won't allow to use an email w/o verification
      if (!profile.emails || !profile.emails[0]) { // user may allow authentication, but disable email access (e.g in fb)
        throw new UserAuthError("При входе разрешите доступ к email. Он используется для идентификации пользователя.");
      }

      authenticateByProfile(req, profile, done);
    } catch (err) {
      console.log(err);
      if (err instanceof UserAuthError) {
        done(null, false, {message: err.message});
      } else {
        done(err);
      }
    }
  }
);
