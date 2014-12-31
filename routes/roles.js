var Role  = require('models/role').Role;
var async = require('async');
var HleFunc = require('libs/func-hle');

exports.list = function(req, res) {
    Role.allList(function(err, role) {
        if (err) {
            res.status(403).json(err);
        } else {
            var count = 0;
            var out = {};
            var txtList = '';
            role.forEach(function(val){
                count++;
                txtList += '<tr data-id="' + val._id + '">' +
                    '<td class="td-1"><div>' + count + '</div></td>'+
                    '<td class="td-2"><div>' + val.name + '</div></td>' +
                    '</tr>';
            });
            out.list  = txtList;
            out.count = count;
            res.status(200).json(out);
        }
    });
};

exports.load = function(req, res) {
    var id = req.body.id;
    async.parallel([
        function(callback) {
            Role.allListObj(id, function(err, roleOffices) {
                callback(null, roleOffices);
            });
        },
        function(callback) {
            Role.allListGroups(id, function(err, roleGroups) {
                callback(null, roleGroups);
            });
        },
        function(callback) {
            Role.idList(id, function(err, role) {
                callback(null, role);
            });
        }
    ],
        function(error, result){
            if (error) {
                res.status(403).json(error);
            } else {
                var count = 0;
                var out = {};
                var txtList = '';

                result[0].forEach(function (val) {
                    count++;
                    txtList += '<tr data-id="' + val._id + '">' +
                        '<td class="td-1"><div>' + count + '</div></td>' +
                        '<td class="td-2"><div>' + val.name + '</div></td>' +
                        '</tr>';
                });
                out.listObj = txtList;
                out.countObj = count;

                count = 0;
                txtList = '';

                result[1].forEach(function (val) {
                    count++;
                    txtList += '<tr data-id="' + val._id + '">' +
                        '<td class="td-1"><div>' + count + '</div></td>' +
                        '<td class="td-2"><div>' + val.name + '</div></td>' +
                        '</tr>';
                });
                out.listGrp      = txtList;
                out.countGrp     = count;
                out.btnMarks     = (result[2].btnMarks) ? 'check' : 'uncheck';
                out.newTasks     = (result[2].newTasks) ? 'check' : 'uncheck';
                out.edtTasks     = (result[2].edtTasks) ? 'check' : 'uncheck';
                out.delTasks     = (result[2].delTasks) ? 'check' : 'uncheck';
                out.perSettings  = (result[2].perSettings) ? 'check' : 'uncheck';
                out.setAllGroup  = (result[2].setAllGroup) ? 'check' : 'uncheck';
                out.setAllObject = (result[2].setAllObject) ? 'check' : 'uncheck';

                res.status(200).json(out);
            }
        }
    );
};

exports.create = function(req, res) {
    var name = req.body.name;
    Role.create(name, function(err, role) {
        if (err) {
            res.status(403).json(err);
        } else {
            res.status(200).json(role);
        }
    });
};

exports.addObj = function(req, res) {
    var id      = req.body.id;
    var idObj   = req.body.idObj;
    Role.addObj(id, idObj, function(err) {
        if (err) {
            res.status(403).json(err);
        } else {
            Role.allListObj(id, function(err, roleObj) {
                if (err) {
                    res.status(403).json(err);
                } else {
                    var count = 0;
                    var out = {};
                    var txtList = '';

                    roleObj.forEach(function (val) {
                        count++;
                        txtList += '<tr data-id="' + val._id + '">' +
                            '<td class="td-1"><div>' + count + '</div></td>' +
                            '<td class="td-2"><div>' + val.name + '</div></td>' +
                            '</tr>';
                    });
                    out.listObj = txtList;
                    out.countObj = count;
                    res.status(200).json(out);
                }
            });
        }
    });
};

exports.removeObj = function(req, res) {
    var id      = req.body.id;
    var idObj   = req.body.idObj;
    Role.delObj(id, idObj, function(err, roleGrp){
        if (err) {
            res.status(403).json(err);
        } else {
            res.status(200).json(roleGrp);
        }
    });
};


exports.addGrp = function(req, res) {
    var id      = req.body.id;
    var idObj   = req.body.idObj;
    Role.addGrp(id, idObj, function(err) {
        if (err) {
            res.status(403).json(err);
        } else {
            Role.allListGroups(id, function(err, roleGrp) {
                if (err) {
                    res.status(403).json(err);
                } else {
                    var count = 0;
                    var out = {};
                    var txtList = '';

                    roleGrp.forEach(function (val) {
                        count++;
                        txtList += '<tr data-id="' + val._id + '">' +
                            '<td class="td-1"><div>' + count + '</div></td>' +
                            '<td class="td-2"><div>' + val.name + '</div></td>' +
                            '</tr>';
                    });
                    out.listObj = txtList;
                    out.countObj = count;
                    res.status(200).json(out);
                }
            });
        }
    });
};

exports.removeGrp = function(req, res) {
    var id      = req.body.id;
    var idObj   = req.body.idObj;
    Role.delGrp(id, idObj, function(err, roleGrp){
        if (err) {
            res.status(403).json(err);
        } else {
            res.status(200).json(roleGrp);
        }
    });
};

exports.update = function(req, res) {
    var name         = req.body.name;
    var id           = req.body.id;
    var btnMark      = req.body.btnMarks;
    var newTask      = req.body.newTasks;
    var edtTask      = req.body.edtTasks;
    var delTask      = req.body.delTasks;
    var perSet       = req.body.perSettings;
    var setAllGroup  = req.body.setAllGroup;
    var setAllObject = req.body.setAllObject;

    Role.update(id, btnMark, newTask, edtTask, delTask, name, perSet, setAllGroup, setAllObject, function(err, role) {
        if (err) {
            res.status(403).json(err);
        } else {
            res.status(200).json(role);
        }
    });
};

exports.change = function(req, res) {
    var role = req.query["role"];
    var a = {};
    var idRolePri   = (!req.session.rolePri || req.session.rolePri == '100000000000000000000001') ? null : req.session.rolePri;
    var idRoleSec   = (!req.session.roleSec || req.session.roleSec == '100000000000000000000001') ? null : req.session.roleSec;

    a.secSta = '';
    a.priSta = '';
    a.secChe = '';
    a.priChe = 'checked';

    if (idRolePri && !idRoleSec) {
        req.session.role = idRolePri;
        a.secSta = 'disabled';
        a.priSta = '';
        a.secChe = '';
        a.priChe = 'checked';
    }
    if (!idRolePri && idRoleSec) {
        req.session.role = idRoleSec;
        a.priSta = 'disabled';
        a.secSta = '';
        a.priChe = '';
        a.secChe = 'checked';
    }
    if (idRolePri && idRoleSec && role == 'true') {
        req.session.role = idRolePri;
        a.secSta = '';
        a.priSta = '';
        a.secChe = '';
        a.priChe = 'checked';
    }
    if (idRolePri && idRoleSec && role == 'false') {
        req.session.role = idRoleSec;
        a.secSta = '';
        a.priSta = '';
        a.secChe = 'checked';
        a.priChe = '';
    }
    req.session.idGroups       = '';
    req.session.idObjects      = '';
    req.session.idYears        = HleFunc.nowQY().year;
    req.session.idQuarters     = HleFunc.nowQY().quarter;
    req.session.radioObjs      = 'true';
    req.session.permitSettings = 'false';
    req.session.roleChg        = a;

    //res.redirect('/home/update');
    res.status(200).json(a);
};
