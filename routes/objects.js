var Object  = require('models/object').Obj;
var Role    = require('models/role').Role;
var async   = require('async');
var HleFunc = require('libs/func-hle');

exports.create = function(req, res) {
    var name    = req.body.name;
    var permit  = true; //req.body.name;
    var type    = 'object'; //req.body.type;
    Object.create(name, type, permit, function(err, object) {
        if (err) {
            res.status(403).json(err);
        } else {
            res.status(200).json(object);
        }
    });
};

exports.update = function(req, res) {
    var id      = req.body.id;
    var name    = req.body.name;
    var permit  = true; //req.body.name;
    var type    = 'object'; //req.body.type;
    Object.update(id, name, type, permit, function(err, object) {
        if (err) {
            res.status(403).json(err);
        } else {
            res.status(200).json(object);
        }
    });
};

exports.remove = function(req, res) {
    var id      = req.body.id;
    Object.remove(id, function(err, object) {
        if (err) {
            res.status(403).json(err);
        } else {
            res.status(200).json(object);
        }
    });
};

exports.list = function(req, res) {
    Object.allList(function(err, obj) {
        if (err) {
            res.status(403).json(err);
        } else {
            var count = 0;
            var out = {};
            var txtList = '';
            obj.forEach(function(val){
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
    var idRole      = req.session.role;
    var defYear     = (!req.session.idYears) ? HleFunc.nowQY().year : req.session.idYears;
    var defQuarter  = (!req.session.idQuarters) ? HleFunc.nowQY().quarter : req.session.idQuarters;
    Role.listObjects(idRole, defQuarter, defYear, function(err, obj) {
        if (err) {
            res.status(403).json(err);
        } else {
            var count = 0;
            var out = {};
            var txtList = '';
            obj.forEach(function(val){
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
