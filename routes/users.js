var User = require('models/user').User;
var HttpError = require('error').HttpError;
var AuthError = require('models/user').AuthError;

exports.create = function(req, res, next) {
    var fullname = req.body.fullname;
    var username = req.body.username;
    var password = req.body.password;
    var role     = req.body.role;
    var email = '';//req.body.email;
    User.create(fullname, email, username, password, role, function(err, user) {
        if (err) {
            if (err instanceof AuthError) {
                next(new HttpError(403, err.message));
            } else {
                next(err);
            }
        } else {
            res.status(200).json(user);
        }
    });
};

exports.update = function(req, res) {
    var id        = req.body.id;
    var fullname  = req.body.fullname;
    var username  = req.body.username;
    var role      = req.body.role;
    var email     = req.body.email;
    var mustPass  = req.body.mustPassword;
    User.update(id, username, fullname, email, role, mustPass, function(err, user) {
        if (err) {
            res.status(403).json(err);
        } else {
            res.status(200).json(user);
        }
    });
};

exports.remove = function(req, res) {
    var id = req.body.id;
    User.remove(id, function(err, user) {
        if (err) {
            res.status(403).json(err);
        } else {
            res.status(200).json(user);
        }
    });
};

exports.updatePassword = function(req, res) {
    var id       = req.body.id;
    var password = req.body.password;
    User.updatePassword(id, password, function(err, user) {
        if (err) {
            res.status(403).json(err);
        } else {
            res.status(200).json(user);
        }
    });
};

exports.list = function(req, res, next) {
    User.list(function(err, user) {
        if (err) {
            next(err);
        } else {
            res.status(200).json(user);
        }
    });
};
