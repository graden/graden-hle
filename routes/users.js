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
            res.json(200, user);
        }
    });
};

exports.update = function(req, res) {
    var id       = req.body.id;
    var fullname = req.body.fullname;
    var username = req.body.username;
    var role     = req.body.role;

    //var password = req.body.password;
    var email = req.body.email;
    User.update(id, username, fullname, email, role, function(err, user) {
        if (err) {
            res.json(403, err);
        } else {
            res.json(200, user);
        }
    });
};

exports.remove = function(req, res) {
    var id = req.body.id;
    User.remove(id, function(err, user) {
        if (err) {
            res.json(403, err);
        } else {
            res.json(200, user);
        }
    });
};

exports.list = function(req, res, next) {
    User.list(function(err, user) {
        if (err) {
            next(err);
        } else {
            res.json(200, user);
        }
    });
};
