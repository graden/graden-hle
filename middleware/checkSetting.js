var HttpError = require('error').HttpError;

module.exports = function(req, res, next) {
    if (!req.session.user) {
        res.redirect('/login');
    } else {
        if (req.session.role != '5406a263f6f2fb960e242314') {
            next(new HttpError(401, "У вас нет разрешения на доступ к данным функциям!"));
        } else {
            next();
        }
    }
};