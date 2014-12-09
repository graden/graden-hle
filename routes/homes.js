var async = require('async');
var Rpt = require('models/report').Rpt;
var Mark = require('models/mark').Mark;
var Task = require('models/task').Task;
var Role = require('models/role').Role;
var User = require('models/user').User;
var CriGroup = require('models/crigroup').CriGroup;
var HleFunc = require('libs/func-hle');

exports.update = function(req, res) {
    var setAllGroup  = (!req.session.setAllGroup) ? 'false' : req.session.setAllGroup;
    var setAllObject = (!req.session.setAllObject) ? 'false' : req.session.setAllObject;
    var idGrp = '100000000000000000000001';
    var idObj = '100000000000000000000001';
    if (setAllGroup == 'false') {
        idGrp = req.body.idGrp;
    }
    if (setAllObject == 'false') {
        idObj = req.body.idObj;
    }
    var idQuarter  = parseInt(req.body.idQuarter);
    var idYear     = parseInt(req.body.idYear);
    var radioObj   = req.body.radioObj;
    var idRole     = req.session.role;
    var lstGroup   = [];
    var prevQY     = HleFunc.prevQY(radioObj, idQuarter, idYear);
    async.parallel([
        function(callback) {
            async.waterfall([
                    function(callback) {
                        Role.listGroups(idRole, callback);
                    },
                    function(roleGroup, callback) {
                        roleGroup.forEach(function (val) {
                            lstGroup.push(val._id);
                        });
                        CriGroup.idList(lstGroup, idGrp, radioObj, function (err, criGroup) {
                            callback(null, criGroup);
                        });
                    }
            ],callback);
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
        function(callback) {
            Task.allList(idGrp, idQuarter, idYear, idObj, radioObj, function(err, task){
                var count = 0;
                var out = {};
                var txtList = '';
                task.forEach(function(val) {
                    count++;
                    txtList += '<tr data-id="' + val._id + '">' +
                        '<td class="td-1"><div>' + count + '</div></td>' +
                        '<td class="td-2"><div>' + val.valueTask + '</div></td>' +
                        '<td class="td-3"><div>' + val.percentTask + '</div></td>' +
                        '</tr>';
                });
                out.list  = txtList;
                out.count = count;
                callback(null, out);
            });
        },
        function(callback) {
            Task.allList(idGrp, prevQY.quarter, prevQY.year, idObj, radioObj, function(err, task){
                var count = 0;
                var out = {};
                var txtList = '';
                task.forEach(function(val) {
                    count++;
                    txtList += '<tr data-id="' + val._id + '">' +
                        '<td class="td-1"><div>' + count + '</div></td>' +
                        '<td class="td-2"><div>' + val.valueTask + '</div></td>' +
                        '<td class="td-3"><div>' + val.percentTask + '</div></td>' +
                        '</tr>';
                });
                out.list  = txtList;
                out.count = count;
                callback(null, out);
            });
        },
        function(callback) {
            Rpt.allList(function(err, rpt){
                var count = 0;
                var out = {};
                var txtList = '';
                rpt.forEach(function(val) {
                    count++;
                    txtList += '<tr data-id="' + val._id + '">' +
                    '<td class="td-1"><div>' + count + '</div></td>' +
                    '<td class="td-2"><div>' + val.name + '</div></td>' +
                    '</tr>';
                });
                out.list  = txtList;
                out.count = count;
                callback(null, out);
            });
        }
    ],
        function(error, result){
            if (error) {
                res.status(403).json(error);
            } else {
                HleFunc.markObj(result[0], result[1], result[2], function (tblMark){
                    var countDef = 0;
                    var count = 0;
                    var countPrev = 0;
                    var avgDef  = 0;
                    var avgPrev = 0;
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
                    req.session.idGroups   = idGrp;
                    req.session.idObjects  = idObj;
                    req.session.idYears    = idYear;
                    req.session.idQuarters = idQuarter;
                    req.session.typeMarks  = radioObj;
                    var a = {};
                    a.mark     = outMark;
                    a.task     = result[3];
                    a.taskPrev = result[4];
                    a.reports  = result[5];
                    a.radar    = JSON.stringify(HleFunc.chartRadar(tblMark));

                    res.status(200).json(a);
                });
            }
        }
    );
};

exports.first = function(req, res) {

    req.session.user = '52e68a1f14ffacf446cf3390';
    req.session.username = 'Test';
    req.session.role = '5406a263f6f2fb960e242314';

    var idGrp       = (!req.session.idGroups) ? '' : req.session.idGroups;
    var idObj       = (!req.session.idObjects) ? '' : req.session.idObjects;
    var idRole      = (!req.session.role) ? null : req.session.role;
    var defYear     = (!req.session.idYears) ? HleFunc.nowQY().year : req.session.idYears;
    var defQuarter  = (!req.session.idQuarters) ? HleFunc.nowQY().quarter : req.session.idQuarters;
    var radioObj    = (!req.session.radioObjs) ? 'true' : req.session.radioObjs;
    var perSet      = (!req.session.permitSettings) ? 'false' : req.session.permitSettings;

    var lstGroup    = [];
    var nameObj     = '';
    var nameGrp     = '';
    async.series([
        function(callback) {
            Role.idList(idRole, function(err, lstRole) {
                perSet = lstRole.perSettings;
                if (lstRole.setAllGroup) {
                    idGrp = '100000000000000000000001';
                }
                if (lstRole.setAllObject) {
                    idObj = '100000000000000000000001';
                }
                callback(null, lstRole);
            });
        },
        function(callback) {
            Role.listGroups(idRole, function(err, crigroup) {
                if (idGrp) {
                    crigroup.forEach(function(val){
                        lstGroup.push(val._id);
                        if (val._id.toString() === idGrp.toString()) {
                            nameGrp = val.name;
                        }
                    });
                    if (nameGrp === '') {
                        idGrp   = crigroup[0]._id.toString();
                        nameGrp = crigroup[0].name.toString();
                    }
                } else {
                    idGrp   = crigroup[0]._id.toString();
                    nameGrp = crigroup[0].name.toString();
                }
                callback(null, crigroup);
            });
        },
        function(callback) {
            Role.listObjects(idRole, defQuarter, defYear, function(err, obj) {
                if (idObj) {
                    obj.forEach(function(val){
                        if (val._id.toString() === idObj.toString()) {
                            nameObj = val.name;
                        }
                    });
                    if (nameObj.length === 0) {
                        idObj   = obj[0]._id.toString();
                        nameObj = obj[0].name.toString();
                    }
                } else {
                    idObj   = obj[0]._id.toString();
                    nameObj = obj[0].name.toString();
                }
                callback(null, obj);
            });
        },
        function(callback) {
            CriGroup.idList(lstGroup, idGrp, radioObj, function(err, criGroup){
                callback(null, criGroup);
            });
        },
        function(callback) {
            User.idList(req.session.user, function(err, result){
                callback(null, result);
            });
        }
    ],
        function(error, result){
            req.session.idGroups        = idGrp;
            req.session.idObjects       = idObj;
            req.session.idYears         = defYear;
            req.session.idQuarters      = defQuarter;
            req.session.radioObjs       = radioObj;
            req.session.permitSettings  = perSet;
            req.session.setAllGroup     = result[0].setAllGroup;
            req.session.setAllObject    = result[0].setAllObject;

            res.cookie('idGrp', idGrp);
            res.cookie('idObj', idObj);
            res.cookie('idYear', defYear);
            res.cookie('idQuarter', defQuarter);
            res.cookie('radioObj', radioObj);
            res.cookie('permitSettings', perSet);
            res.cookie('setAllGroup', result[0].setAllGroup);
            res.cookie('setAllObject', result[0].setAllObject);

            //console.log('name= ', nameGrp, nameObj);
            res.render('home.ejs', {
                username:    'Пользователь: ' + result[4].fullname,
                txtObject:   nameObj,
                txtGroup:    nameGrp
            });
        }
    );

};

exports.redi = function(req, res) {
    res.redirect('/home');
};