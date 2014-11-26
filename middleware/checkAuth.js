var HttpError = require('error').HttpError;

module.exports = function(req, res, next) {
  if (!req.session.user) {
        //next(new HttpError(401, "Вы не авторизованы"));
        res.redirect('/login');
  } else {
        next();
  }
};