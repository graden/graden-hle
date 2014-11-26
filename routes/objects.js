var Object = require('models/object').Obj;
var Role   = require('models/role').Role;

exports.list = function(req, res) {
    Object.allList(function(err, obj) {
        if (err) {
            res.json(403, err);
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
            res.json(200, out);
        }
    });
};

exports.listRole = function(req, res) {
    var idRole = req.session.role;
    Role.listObjects(idRole, function(err, obj) {
        if (err) {
            res.json(403, err);
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
            res.json(200, out);
        }
    });
};
