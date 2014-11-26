var HttpError = require('error').HttpError;

module.exports = function(req, res, next) {
  if (req.session.user && req.session.role == '5406a263f6f2fb960e242314') {
      next();
      //next(new HttpError(401, "Доступ закрыт!"));
  } else {
      res.redirect('/home');
  }
};