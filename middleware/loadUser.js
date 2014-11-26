var User = require('models/user').User;

module.exports = function(req, res, next) {
  req.user = res.locals.user = null;

  if (req.session.user) {
      User.findById(req.session.user, function(err, user) {
          if (!err) {
              req.user = res.locals.user = user;
              next();
          } else {
              next(err);
          }
      });
  } else {
      next();
  }
};