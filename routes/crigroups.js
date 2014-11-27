var CriGroup = require('models/crigroup').CriGroup;
var Role     = require('models/role').Role;

exports.list = function(req, res) {
    CriGroup.allList(function(err, crigroup) {
        if (err) {
            res.status(403).json(err);
        } else {

            var count = 0;
            var out = {};
            var txtList = '';
            crigroup.forEach(function(val){
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

exports.listRole = function(req, res) {
    var idRole = req.session.role;
    Role.listGroups(idRole, function(err, crigroup) {
        if (err) {
            res.status(403).json(err);
        } else {
            var count = 0;
            var out = {};
            var txtList = '';
            crigroup.forEach(function(val){
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

exports.create = function(req, res) {
    var name = req.body.name;
    var permit = true;
    CriGroup.create(name, permit, function(err, crigroup) {
        if (err) {
            res.status(403).json(err);
        } else {
            res.status(200).json(crigroup);
        }
    });
};

exports.update = function(req, res) {
    var id   = req.body.id;
    var name = req.body.name;
    var permit = true;
    CriGroup.update(id, name, permit, function(err, crigroup) {
        if (err) {
            res.status(403).json(err);
        } else {
            res.status(200).json(crigroup);
        }
    });
};

exports.remove = function(req, res) {
    var id   = req.body.id;
    CriGroup.remove(id, function(err, crigroup) {
        if (err) {
            res.status(403).json(err);
        } else {
            res.status(200).json(crigroup);
        }
    });
};