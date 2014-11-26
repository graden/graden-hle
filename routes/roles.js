var Role  = require('models/role').Role;
var async = require('async');

exports.list = function(req, res) {
    Role.allList(function(err, role) {
        if (err) {
            res.json(403, err);
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
            res.json(200, out);
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
        },
    ],
        function(error, result){
            if (error) {
                res.json(403, error);
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
                out.listGrp = txtList;
                out.countGrp = count;

                if (result[2].btnMarks) {
                    out.btnMarks = 'check';
                } else {
                    out.btnMarks = 'uncheck';
                }

                if (result[2].newTasks) {
                    out.newTasks = 'check';
                } else {
                    out.newTasks = 'uncheck';
                }

                if (result[2].edtTasks) {
                    out.edtTasks = 'check';
                } else {
                    out.edtTasks = 'uncheck';
                }

                if (result[2].delTasks) {
                    out.delTasks = 'check';
                } else {
                    out.delTasks = 'uncheck';
                }

                if (result[2].perSettings) {
                    out.perSettings = 'check';
                } else {
                    out.perSettings = 'uncheck';
                }

                res.json(200, out);
            }
        }
    );
};

exports.create = function(req, res) {
    var name = req.body.name;
    Role.create(name, function(err, role) {
        if (err) {
            res.json(403, err);
        } else {
            res.json(200, role);
        }
    });
};

exports.addObj = function(req, res) {
    var id      = req.body.id;
    var idObj   = req.body.idObj;
    Role.addObj(id, idObj, function(err) {
        if (err) {
            res.json(403, err);
        } else {
            Role.allListObj(id, function(err, roleObj) {
                if (err) {
                    res.json(403, err);
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
                    res.json(200, out);
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
            res.json(403, err);
        } else {
            res.json(200, roleGrp);
        }
    });
};


exports.addGrp = function(req, res) {
    var id      = req.body.id;
    var idObj   = req.body.idObj;
    Role.addGrp(id, idObj, function(err) {
        if (err) {
            res.json(403, err);
        } else {
            Role.allListGroups(id, function(err, roleGrp) {
                if (err) {
                    res.json(403, err);
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
                    res.json(200, out);
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
            res.json(403, err);
        } else {
            res.json(200, roleGrp);
        }
    });
};


exports.update = function(req, res) {
    var name    = req.body.name;
    var id      = req.body.id;
    var btnMark = req.body.btnMarks;
    var newTask = req.body.newTasks;
    var edtTask = req.body.edtTasks;
    var delTask = req.body.delTasks;
    var perSet  = req.body.perSettings;
    Role.update(id, btnMark, newTask, edtTask, delTask, name, perSet, function(err, role) {
        if (err) {
            res.json(403, err);
        } else {
            res.json(200, role);
        }
    });
};
