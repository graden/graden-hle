var Subject = require('models/subject').Subject;
var libDate = require('libs/libDate');

exports.create = function(req, res) {
    var fName    = req.body.fName;
    var sName    = req.body.sName;
    var tName    = req.body.tName;
    var idObj    = req.body.idObj;
    Subject.create(idObj, fName, sName, tName, null, function(err, sbj) {
        if (err) {
            res.status(403).json(err);
        } else {
            res.status(200).json(sbj.idObj);
        }
    });
};

exports.update = function(req, res) {
    var fName    = req.body.fName;
    var sName    = req.body.sName;
    var tName    = req.body.tName;
    var id       = req.body.id;
    Subject.update(id, fName, sName, tName, null, function(err, sbj) {
        if (err) {
            res.status(403).json(err);
        } else {
            res.status(200).json(sbj.idObj);
        }
    });
};

exports.remove = function(req, res) {
    var id = req.body.id;
    Subject.remove(id, function(err, sbj) {
        if (err) {
            res.status(403).json(err);
        } else {
            res.status(200).json(sbj.idObj);
        }
    });
};

exports.list = function(req, res) {
    var id = req.param ('id');
    var de = null;
    Subject.list(id, function(err, sbj) {
        if (err) {
            res.status(403).json(err);
        } else {
            var count = 0;
            var out = {};
            var txtList = '';
            if (sbj) {
                sbj.forEach(function (val) {
                    count++;
                    if (val.dateEnd) {
                        de = val.dateEnd.format('dd/mm/yyyy');
                    } else {
                        de = '';
                    }
                    txtList += '<tr data-id="' + val._id + '" data-idObj="' + val.idObj +
                    '" data-fName="' + val.fName + '" data-sName="' + val.sName + '" data-tName="' + val.tName + '">' +
                    '<td class="td-1"><div>' + count + '</div></td>' +
                    '<td class="td-2"><div>' + val.fName + ' ' + val.sName + ' ' + val.tName + '</div></td>' +
                    '<td class="td-3"><div>' +  val.dateBegin.format('dd/mm/yyyy') + '</div></td>' +
                    '<td class="td-4"><div>' +  de + '</div></td>' +
                    '</tr>';
                });
            }
            out.list  = txtList;
            out.count = count;
            res.status(200).json(out);
        }
    });
};

