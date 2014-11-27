var Cri      = require('models/cri').Cri;
var CriGroup = require('models/crigroup').CriGroup;

exports.update = function(req, res) {
    var id      = req.body.id;
    var name    = req.body.name;
    var permit  = true;
    Cri.update(id, name, permit, function(err, cri){
        if (err) {
            res.status(403).json(err);
        } else {
            res.status(200).json(cri);
        }
    });
};

exports.create = function(req, res) {
    var name    = req.body.name;
    var permit  = true;
    Cri.create(name, permit, function(err, cri){
        if (err) {
            res.status(403).json(err);
        } else {
            res.status(200).json(cri);
        }
    });
};

exports.remove = function(req, res) {
    var id = req.body.id;
    CriGroup.verif(id, function(error){
        if (error) {
            res.status(403).json(error);
        } else {
            Cri.remove(id, function(err, cri){
                if (err) {
                    res.status(403).json(err);
                } else {
                    res.status(200).json(cri);
                }
            });
        }
    });



};
