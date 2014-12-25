var Period   = require('models/period').Period;

exports.update = function(req, res) {
    var id       = req.body.id;
    var name     = req.body.name;
    var code     = req.body.code;
    var desc     = req.body.desc;
    var count    = req.body.count;
    var permit   = true;
    Period.update(id, name, desc, count, code, permit, function(err, period){
        if (err) {
            res.status(403).json(err);
        } else {
            res.status(200).json(period);
        }
    });
};

exports.create = function(req, res) {
    var name     = req.body.name;
    var code     = req.body.code;
    var desc     = req.body.desc;
    var count    = req.body.count;
    var permit   = true;
    Period.create(name, desc, count, code, permit, function(err, period){
        if (err) {
            res.status(403).json(err);
        } else {
            res.status(200).json(period);
        }
    });
};
