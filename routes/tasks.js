var Task = require('models/task').Task;
var HttpError = require('error').HttpError;

exports.create = function(req, res) {
    var idGrp       = req.body.idGrp;
    var idObj       = req.body.idObj;
    var idQuarter   = req.body.idQuarter;
    var idYear      = req.body.idYear;
    var taskValue   = (req.body.taskValue.length === 0) ? '' : req.body.taskValue;
    var taskPercent = (req.body.taskPercent.length === 0) ? 0 : req.body.taskPercent;
    var setTask    = req.body.setTask;
    var defTask    = req.body.defTask;
    var typeValue   = req.body.typeValue;
    var radioObj    = req.body.radioObj;
    if (idGrp === '100000000000000000000001' || idObj === '100000000000000000000001') {
        res.status(403).json(new HttpError(403, "Нельзя создать задачу в консолидированном режиме!"));
        return;
    }
    Task.create(idGrp, idQuarter, idYear, idObj, taskValue, taskPercent, setTask, defTask, typeValue, radioObj, function(err, task){
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
    var taskValue   = (req.body.taskValue.length == 0) ? '' : req.body.taskValue;

    var setTask     = req.body.setTask;
    var defTask     = req.body.defTask;
    var taskPercent = (setTask == 0) ? 0 : (defTask *100)/setTask;
    var typeValue   = req.body.typeValue;
    var radioObj    = req.body.radioObj;
    if (idGrp === '100000000000000000000001' || idObj === '100000000000000000000001') {
        res.status(403).json(new HttpError(403, "Нельзя изменить задачу в консолидированном режиме!"));
        return;
    }
    Task.update(idTask, idGrp, idQuarter, idYear, idObj, taskValue, taskPercent, setTask, defTask, typeValue, radioObj, function(err, task){
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
            res.status(403).json(err);
        } else {
            res.status(200).json(task);
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
            res.status(403).json(err);
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
            res.status(200).json(out);
        }
    });
};