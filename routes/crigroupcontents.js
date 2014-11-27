var async    = require('async');
var CriGroup = require('models/crigroup').CriGroup;
var Cri      = require('models/cri').Cri;

exports.choice = function(req, res) {
    var idGrp = req.body.id;
    var typeObj = req.body.typeObj;
    var a = [];
    var lstGrp = [];

    async.parallel([
        function(callback) {
            CriGroup.idList(lstGrp, idGrp, typeObj, function(err, crigroup){
                callback(null, crigroup);
            });
        },
        function(callback) {
            Cri.allList(function(err, cri) {
                for (var i = 0; i < cri.length; i++ ){
                    a.push(cri[i]);
                }
                callback(null, cri);
            });
        },
    ],
        function(error, result){
            if (error) {
                res.send(403, error);
            } else {
                for (var i = 0; i < result[0].length; i++) {
                    for(var j = 0; j < a.length; j++) {
                        if (result[0][i]._id.toString() == a[j]._id.toString()) {
                            a.splice(j,1);
                        }
                    }
                }
                res.send(200, a);
            }
        }
    );
};

exports.addLinkCri = function(req, res) {
    var idGrp = req.body.id;
    var idCri = req.body.idCri;
    var typeObj = req.body.typeObj;
    CriGroup.addLinkCri(idGrp, idCri, typeObj, function(err, crigroup){
        if (err) {
            res.status(403).json(err);
        } else {
            res.status(200).json(crigroup);
        }
    });
};

exports.removeLinkCri = function(req, res) {
    var idGrp = req.body.id;
    var idCri = req.body.idCri;
    var typeObj = req.body.typeObj;
    CriGroup.removeLinkCri(idGrp, idCri, typeObj, function(err, crigroup){
        if (err) {
            res.status(403).json(err);
        } else {
            res.status(200).json(crigroup);
        }
    });
};

exports.list = function(req, res) {
    var idGrp = req.body.id;
    var typeObj = req.body.typeObj;
    var lstGrp = [];
    CriGroup.idList(lstGrp, idGrp, typeObj, function(err, crigroup){
        if (err) {
            res.status(403).json(err);
        } else {
            res.status(200).json(crigroup);
        }
    });
};

