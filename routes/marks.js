var async     = require('async');
var Mark      = require('models/mark').Mark;
var CriGroup  = require('models/crigroup').CriGroup;
var HleFunc   = require('libs/func-hle');
var AuthError = require('error').AuthError;
var HttpError = require('error').HttpError;

exports.update = function(req, res) {
    var idObj      = req.body.idObj;
    var idGrp      = req.body.idGrp;
    var idQuarter  = req.body.idQuarter;
    var idYear     = req.body.idYear;
    var idCri      = req.body.idCri;
    var idMark     = req.body.idMark;
    var vMark      = req.body.vMark;
    //var vMark1     = req.body.vMark1;
    //var vMark2     = req.body.vMark2;
    //var vMark3     = req.body.vMark3;
    //var vMark4     = req.body.vMark4;
    //var vMark5     = req.body.vMark5;
    //var vMark6     = req.body.vMark6;
    //var vMark7     = req.body.vMark7;
    //var vMark8     = req.body.vMark8;
    //var vMark9     = req.body.vMark9;
    var radioObj   = req.body.radioObj;
    if (idGrp === '100000000000000000000001' || idObj === '100000000000000000000001') {
        res.send(new HttpError(403, "Изменение усредненых значений не возможно!"));
        return;
    }
    var prevQY     = HleFunc.prevQY(radioObj, idQuarter, idYear);
    Mark.update(vMark, vMark1, vMark2, vMark3, vMark4, vMark5, vMark6, vMark7, vMark8, vMark9,
        idMark, idGrp, idCri, idQuarter, idYear, idObj, radioObj, function(err, data){
        if (err) {
            res.status(403).send(err);
        } else {
            if (data) {
                async.parallel([
                    function(callback) {
                        CriGroup.idList([], idGrp, radioObj, function(err, criGroup){
                            callback(null, criGroup);
                        });
                    },
                    function(callback) {
                        Mark.allList(idGrp, idQuarter, idYear, idObj, radioObj, function(err, markDef){
                            callback(null, markDef);
                        });
                    },
                    function(callback) {
                        Mark.allList(idGrp, prevQY.quarter, prevQY.year, idObj, radioObj, function(err, markPrev){
                            callback(null, markPrev);
                        });
                    }
                ],
                    function(error, result){
                        HleFunc.markObj(result[0], result[1], result[2], function (tblMark){
                            var a = {};
                            var count   = 0;
                            var avgDef  = 0;
                            var avgPrev = 0;
                            var countDef  = 0;
                            var countPrev = 0;
                            var outMark = {};
                            tblMark.forEach(function(val) {
                                count++;
                                if (val.markDef !== 0) {
                                    countDef++;
                                }
                                if (val.markPrev !== 0) {
                                    countPrev++;
                                }

                                avgDef   += val.markDef;
                                avgPrev  += val.markPrev;
                                outMark.list += '<tr data-id=' + val._id + ' data-id-mark=' + val.idMark + '>' +
                                    '<td class="td-1"><div>' + count + '</div></td>' +
                                    '<td class="td-2"><div>' + val.name + '</div></td>' +
                                    '<td class="td-3 td-bold"><div>' + val.markDef.toFixed(2) + '</div></td>' +
                                    '<td class="td-4"><div>' + val.markPrev.toFixed(2) + '</div></td>' +
                                    '</tr>';
                            });
                            outMark.avgDef  = (countDef === 0) ? 0 : (avgDef/countDef).toFixed(2);
                            outMark.avgPrev = (countPrev === 0) ? 0 : (avgPrev/countPrev).toFixed(2);
                            outMark.count   = count;
                            a.mark          = outMark;
                            a.radar         = JSON.stringify(HleFunc.chartRadar(tblMark));
                            res.status(200).send(a);
                        });
                    }
                );
            } else {
                res.status(403).send(new AuthError("Ничего не добавлено!"));
            }
        }
    });
};

exports.access = function(req, res) {
    res.status(200).json('OK');
};
