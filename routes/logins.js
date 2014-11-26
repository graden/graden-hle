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
        req.session.role = user.role;
        res.json(200, 'OK');
    }
  });

};