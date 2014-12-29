var mongoose = require('libs/mongoose'),
    Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var schema = new Schema ({
    createDate:   {type: Date, default: Date.now},
    modifyDate:   {type: Date, default: Date.now},
    valueTask:    {type: String},
    percentTask:  {type: Number, defualt: 0},
    typeValue:    {type: Number},
    setTask:      {type: Number, defualt: 0},
    defTask:      {type: Number, defualt: 0},
    valueQuarter: {type: Number},
    valueYear:    {type: Number},
    linkCriGroup: {type: ObjectId, ref: 'dsCriGroup'},
    linkCri:      {type: ObjectId, ref: 'dsCri'},
    linkObject:   {type: ObjectId, ref: 'dsObject'},
    linkType:     {type: String, default: 'true'},
    comment:      {type: String}
});

schema.statics.allList = function(idGrp, idQuarter, idYear, idObj, radioObj, callback) {
    var Task = this;
    var objFind = {linkCriGroup: idGrp, valueQuarter: idQuarter, valueYear: idYear,
        linkObject: idObj, linkType: radioObj};

    if (idGrp === '100000000000000000000001' && idObj !== '100000000000000000000001') {
        objFind = {valueQuarter: idQuarter, valueYear: idYear,
            linkObject: idObj, linkType: radioObj};
    }
    if (idGrp !== '100000000000000000000001' && idObj === '100000000000000000000001') {
        objFind = {linkCriGroup: idGrp, valueQuarter: idQuarter,
            valueYear: idYear, linkType: radioObj};
    }
    if (idGrp === '100000000000000000000001' && idObj === '100000000000000000000001') {
        objFind = {valueQuarter: idQuarter, valueYear: idYear,
            linkType: radioObj};
    }
    Task.find(objFind).exec(function (err, task) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, task);
        }
    });
};

schema.statics.create = function(idGrp, idQuarter, idYear, idObject, value, percent, setTask, defTask, typeValue, radioObj, callback) {
    var Task = this;
    var tsk = new Task({linkCriGroup:idGrp, valueQuarter:idQuarter,
                        valueYear:idYear, linkObject:idObject,
                        valueTask:value, percentTask:percent,
                        setTask:setTask, defTask:defTask, typeValue: typeValue, linkType: radioObj});
        tsk.save(function(err){
            if (err) {
                callback(err, null);
            } else {
                callback(null,tsk);
            }
        });
};

schema.statics.update = function(idTask, idGrp, idQuarter, idYear, idObject, value, percent, setTask, defTask, typeValue, radioObj, callback) {
    var Task = this;
    Task.findByIdAndUpdate(idTask,{$set: {linkCriGroup:idGrp, valueQuarter:idQuarter, valueYear:idYear,
                                          linkObject:idObject, valueTask:value, percentTask:percent, setTask:setTask,
                                          defTask:defTask, typeValue:typeValue, modifyDate: new Date(), linkType: radioObj}}).exec(function(err, task){
            if (err) {
                callback(err, null);
            } else {
                callback(null, task);
            }
        });
};

schema.statics.remove = function(id, callback) {
    var Task = this;
    Task.findByIdAndRemove(id , function (err, task) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, task);
        }
    });
};

exports.Task = mongoose.model('dsTasks', schema);