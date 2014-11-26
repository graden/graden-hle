var Task = require('models/task').Task;

exports.create = function(req, res) {
    var idGrp       = req.body.idGrp;
    var idObj       = req.body.idObj;
    var idQuarter   = req.body.idQuarter;
    var idYear      = req.body.idYear;
    var taskValue   = (req.body.taskValue.length === 0) ? '' : req.body.taskValue;
    var taskPercent = (req.body.taskPercent.length === 0) ? 0 : req.body.taskPercent;
    Task.create(idGrp, idQuarter, idYear, idObj, taskValue, taskPercent, function(err, task){
        if (err) {
            res.status(403).json(err);
        } else {
            res.status(200).json(task);
        }
    });
};

exports.update = function(req, res) {
    var idTask      = req.body.id;
    var idGrp       = req.body.idGrp;
    var idObj       = req.body.idObj;
    var idQuarter   = req.body.idQuarter;
    var idYear      = req.body.idYear;
    var taskValue   = (req.body.taskValue.length === 0) ? '' : req.body.taskValue;
    var taskPercent = (req.body.taskPercent.length === 0) ? 0 : req.body.taskPercent;

    Task.update(idTask, idGrp, idQuarter, idYear, idObj, taskValue, taskPercent, function(err, task){
        if (err) {
            res.status(403).json(err);
        } else {
            res.status(200).json(task);
        }
    });
};

exports.remove = function(req, res) {
    var idTask = req.body.id;

    Task.remove(idTask, function(err, task){
        if (err) {
            res.json(403, err);
        } else {
            res.json(200, task);
        }
    });
};

exports.load = function(req, res) {
    var idGrp       = req.body.idGrp;
    var idObj       = req.body.idObj;
    var idQuarter   = req.body.idQuarter;
    var idYear      = req.body.idYear;
    var radioObj    = req.body.radioObj;
    Task.allList(idGrp, idQuarter, idYear, idObj, radioObj, function(err, task){
        if (err) {
            res.json(403, err);
        } else {
            var i = 0;
            var out = {};
            var txtBody = '';
            task.forEach(function(val) {
                i++;
                txtBody += '<tr data-id="' + val._id + '">' +
                    '<td class="td-1"><div>' + i + '</div></td>' +
                    '<td class="td-2"><div>' + val.valueTask + '</div></td>' +
                    '<td class="td-3"><div>' + val.percentTask + '</div></td>' +
                    '</tr>';
            });
            out.list  = txtBody;
            out.count = i;
            res.json(200, out);
        }
    });
};