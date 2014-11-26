exports.get = function(req, res) {
    console.log('Выход из системы');
    req.session.destroy();
    res.redirect('/login');
};