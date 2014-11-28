var logs  = require('libs/logs')('logout');
exports.get = function(req, res) {
    logs.info('Выход из системы');
    req.session.destroy();
    res.redirect('/login');
};