var async     = require('async');
var Mark      = require('models/mark').Mark;
var CriGroup  = require('models/crigroup').CriGroup;
var HleFunc   = require('libs/func-hle');
var AuthError = require('error').AuthError;

exports.update = function(req, res) {
    var idObj      = req.body.idObj;
    var idGrp      = req.body.idGrp;
    var idQuarter  = req.body.idQuarter;
    var idYear     = req.body.idYear;
    var idCri      = req.body.idCri;
    var idMark     = req.body.idMark;
    var vMark      = req.body.vMark;
    var radioObj   = req.body.radioObj;
    var prevQY     = HleFunc.prevQY(radioObj, idQuarter, idYear);
    Mark.update(vMark, idMark, idGrp, idCri, idQuarter, idYear, idObj, radioObj, function(err, data){
        if (err) {
            res.send(403, err);
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
                    },
                ],
                    function(error, result){
                        HleFunc.markObj(result[0], result[1], result[2], function (tblMark){
                            var a = {};
                            var count   = 0;
                            var avgDef  = 0;
                            var avgPrev = 0;
                            var outMark = {};
                            tblMark.forEach(function(val) {
                                count++;
                                avgDef   += val.markDef;
                                avgPrev  += val.markPrev;
                                outMark.list += '<tr data-id=' + val._id + ' data-id-mark=' + val.idMark + '>' +
                                    '<td class="td-1"><div>' + count + '</div></td>' +
                                    '<td class="td-2"><div>' + val.name + '</div></td>' +
                                    '<td class="td-3"><div>' + val.markDef.toFixed(2) + '</div></td>' +
                                    '<td class="td-4"><div>' + val.markPrev.toFixed(2) + '</div></td>' +
                                    '</tr>';
                            });
                            outMark.avgDef  = (count === 0) ? 0 : (avgDef/count).toFixed(2);
                            outMark.avgPrev = (count === 0) ? 0 : (avgPrev/count).toFixed(2);
                            outMark.count   = count;
                            a.mark          = outMark;
                            a.radar         = JSON.stringify(HleFunc.chartRadar(tblMark));
                            res.send(200, a);
                        });
                    }
                );
            } else {
                res.send(403, new AuthError("Ничего не добавлено!"));
            }
        }
    });
};
