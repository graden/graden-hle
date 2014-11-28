var User = require('models/user').User;
var HttpError = require('error').HttpError;
var AuthError = require('error').AuthError;

exports.get = function(req, res) {
  res.render('login');
};

exports.post = function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  User.authorize(username, password, function(err, user) {
    if (err) {
      if (err instanceof AuthError) {
           next(new HttpError(403, err.message));
      } else {
           next(err);
      }
    } else {
        req.session.user = user._id;
        req.session.username = user.username;
        req.session.role = user.role;
        if (user.mustChgPassword) {
            res.status(201).json(user._id);
        } else {
            res.status(200).json('OK');
        }

    }
  });

};