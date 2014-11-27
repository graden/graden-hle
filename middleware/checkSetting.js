var HttpError = require('error').HttpError;
var url       = require("url");
var Role      = require('models/role').Role;

exports.setting = function(req, res, next) {
    var reqPath = url.parse(req.url).pathname;
    if (!req.session.user) {
        res.redirect('/login');
    } else {
        var idRole = req.session.role;
        Role.idList(idRole, function(err, role) {
            if (reqPath == '/setting' && !role.perSettings) {
                next(new HttpError(401, "Вам закрыт доступ к настройкам. Обратитесь к администратору!"));
            } else {
                next();
            }
        });
    }
};

exports.permitMark = function(req, res, next) {
    var reqPath = url.parse(req.url).pathname;
    if (!req.session.user) {
        res.redirect('/login');
    } else {
        var idRole = req.session.role;
        Role.idList(idRole, function(err, role) {
            if (reqPath == '/mark/update' && !role.btnMarks) {
                next(new HttpError(401, "Вам закрыт доступ к изменению оценки. Обратитесь к администратору!"));
            } else {
                next();
            }
        });
    }
};

exports.editTask = function(req, res, next) {
    var reqPath = url.parse(req.url).pathname;
    if (!req.session.user) {
        res.redirect('/login');
    } else {
        var idRole = req.session.role;
        Role.idList(idRole, function(err, role) {
            if (reqPath == '/task/update' && !role.edtTasks) {
                next(new HttpError(401, "Вам закрыт доступ к изменению задачи. Обратитесь к администратору!"));
            } else {
                next();
            }
        });
    }
};

exports.createTask = function(req, res, next) {
    var reqPath = url.parse(req.url).pathname;
    if (!req.session.user) {
        res.redirect('/login');
    } else {
        var idRole = req.session.role;
        Role.idList(idRole, function(err, role) {
            if (reqPath == '/task/create' && !role.newTasks) {
                next(new HttpError(401, "Вам закрыт доступ к созданию задачи. Обратитесь к администратору!"));
            } else {
                next();
            }
        });
    }
};

exports.removeTask = function(req, res, next) {
    var reqPath = url.parse(req.url).pathname;
    if (!req.session.user) {
        res.redirect('/login');
    } else {
        var idRole = req.session.role;
        Role.idList(idRole, function(err, role) {
            if (reqPath == '/task/remove' && !role.delTasks) {
                next(new HttpError(401, "Вам закрыт доступ к удалению задачи. Обратитесь к администратору!"));
            } else {
                next();
            }
        });
    }
};