var async    = require('async');
var mongoose = require('libs/mongoose');
var HleFunc  = require('libs/func-hle');
var Schema   = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var schema = new Schema({
    name:           {type: String},
    objects:        [{type: ObjectId, ref: 'dsObjects'}],
    crigroups:      [{type: ObjectId, ref: 'dsCriGroups'}],
    btnMarks:       {type: Boolean, default: true},
    newTasks:       {type: Boolean, default: true},
    edtTasks:       {type: Boolean, default: true},
    delTasks:       {type: Boolean, default: true},
    perSettings:    {type: Boolean, default: false},
    modified:       {type: Date, default: Date.now},
    created:        {type: Date, default: Date.now}
});

schema.statics.listGroups = function(id, callback) {
    var Role = this;
    var a = {};
    Role.findById(id).populate('crigroups').exec(function(err, role){
        if (err) {
            callback(err, null);
        } else {
            if (role.crigroups) {
                a._id    = '100000000000000000000001';
                a.name   = 'Все направления';
                a.permit = true;
                role.crigroups.push(a);
                callback(null, role.crigroups);
            } else {
                callback(null, null);
            }
        }
    });
};

schema.statics.listObjects = function(id, callback) {
    var Role = this;
    var a = {};
    Role.findOne({_id:id}).populate('objects').exec(function(err, role){
        if (err) {
            callback(err, null);
        } else {
            if (role.objects) {
                a._id = '100000000000000000000001';
                a.name = 'Все объекты';
                a.permit = true;
                a.type = 'object';
                role.objects.push(a);
                callback(null, role.objects);
            } else {
                callback(null, null);
            }
        }
    });
};


schema.statics.allListGroups = function(id, callback) {
    var Role = this;
    Role.findOne({_id: id}).populate('crigroups').exec(function(err, role){
        if (err) {
            callback(err, null);
        } else {
            callback(null, role.crigroups);
        }
    });
};

schema.statics.allListObj = function(id, callback) {
    var Role = this;
    Role.findOne({_id: id}).populate('objects').exec(function (err, role) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, role.objects);
        }
    });
};

schema.statics.allList = function(callback) {
    var Role = this;
    Role.find().exec(function(err, role){
        if (err) {
            callback(err, null);
        } else {
            callback(null, role);
        }
    });
};

schema.statics.idList = function(id, callback) {
    var Role = this;
    Role.findById(id).exec(function(err, role){
        if (err) {
            callback(err, null);
        } else {
            callback(null, role);
        }
    });
};

schema.statics.create = function(name, callback) {
    var Role = this;
    var role = new Role({name:name});
    role.save(function(err){
        if (err) {
            callback(err, null);
        } else {
            callback(null,role);
        }
    });

};

schema.statics.update = function(id, btnMark, newTask, edtTask, delTask, name, perSettings, callback) {
    var Role = this;
    Role.findByIdAndUpdate(id,{$set: {btnMarks:btnMark, newTasks:newTask, edtTasks:edtTask,
        delTasks:delTask, name:name, perSettings:perSettings}}).exec(function(err, role){
        if (err) {
            callback(err, null);
        } else {
            callback(null, role);
        }
    });
};

schema.statics.addObj = function(id, idObj, callback) {
    var Role = this;
    Role.findByIdAndUpdate(id, { $pushAll: { objects: [idObj]} }, function (err, role) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, role.objects);
        }
    });
};

schema.statics.delObj = function(id, idObj, callback) {
    var Role = this;
    Role.findByIdAndUpdate(id, { $pullAll: { objects: [idObj]} }, function (err, role) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, role.objects);
        }
    });
};

schema.statics.addGrp = function(id, idGrp, callback) {
    var Role = this;
    Role.findByIdAndUpdate(id, { $pushAll: { crigroups: [idGrp]} }, function (err, role) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, role.crigroups);
        }
    });
};

schema.statics.delGrp = function(id, idGrp, callback) {
    var Role = this;
    Role.findByIdAndUpdate(id, { $pullAll: { crigroups: [idGrp]} }, function (err, role) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, role.crigroups);
        }
    });
};


exports.Role = mongoose.model('dsRoles', schema);

