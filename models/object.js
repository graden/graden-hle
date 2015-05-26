var async = require('async');
var mongoose = require('libs/mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var schema = new Schema ({
    name:         {type: String, required: true},
    tPeriodObj:   {type: ObjectId, ref: 'dsPeriods'},
    tPeriodSbj:   {type: ObjectId, ref: 'dsPeriods'},
    tDirGroups:   {type: ObjectId, ref: 'dsDirGroups'},
    type:         {type: String, default: 'object'},
    permit:       {type: Boolean, default: true},
    modified:     {type: Date, default: Date.now},
    created:      {type: Date, default: Date.now}
});

schema.statics.allList = function(callback) {
    var Obj = this;
    Obj.find({}).populate('tPeriodObj').populate('tPeriodSbj').populate('tDirGroups').exec(function(err, obj){
        if (err) {
            callback(err, null);
        } else {
            callback(null, obj);
        }
    });
};

schema.statics.allListPlus = function(callback) {
    var Obj = this;
    var a = {};
    Obj.find({}).exec(function(err, obj){
        if (err) {
            callback(err, null);
        } else {
            a._id = '100000000000000000000001';
            a.name = 'Все';
            a.permit = true;
            a.type = 'object';
            obj.push(a);
            callback(null, obj);
        }
    });
};

schema.statics.idList = function(id, callback) {
    var Obj = this;
    if (id === '100000000000000000000001') {
        callback(null, 'Все');
    } else {
        Obj.findById(id).exec(function(err, obj){
            if (err) {
                callback(err, null);
            } else {
                callback(null, obj.name);
            }
        });
    }
};

schema.statics.create = function(name, type, permit, periodObj, periodSbj, dirGroups, callback) {
    var Obj = this;
    var id  = ObjectId;
    async.waterfall([
        function(callback) {
            Obj.findOne({name: name}, callback);
        },
        function(obj, callback) {
            if (obj) {
                callback(new AuthError("Такой объект уже существует!"));
            } else {
                obj = new Obj({_id: id, name: name, type: type, tPeriod: period, tDirGroups: dirGroups, permit: permit});
                obj.save(function(err) {
                    if (err) {
                        callback(err, null);
                    } else {
                        Obj.findById(id).populate('tPeriodObj').populate('tPeriodSbj').populate('tDirGroups').exec(function (err,objRef){
                            if (err) {
                                callback(err, null);
                            } else {
                                callback(null, objRef);
                            }
                        });
                    }
                });
            }
        }
    ], callback);
};

schema.statics.update = function(id, name, type, permit, periodObj, periodSbj, dirGroups, callback) {
    var Obj = this;
    Obj.findById(id, function(err, obj) {
        if (err) {
            callback(err, null);
        } else {
            obj.name        = name;
            obj.type        = type;
            obj.tPeriodObj  = periodObj;
            obj.tPeriodSbj  = periodSbj;
            obj.tDirGroups  = dirGroups;
            obj.permit      = permit;
            obj.modified    = new Date();
            obj.save(function(err) {
                if (err) {
                    callback(err, null);
                } else {
                    Obj.findById(id).populate('tPeriodObj').populate('tPeriodSbj').populate('tDirGroups').exec(function(err,objRef){
                        if (err) {
                            callback(err, null);
                        } else {
                            callback(null, objRef);
                        }
                    });
                }
            })
        }
    });

};

schema.statics.remove  = function(id, callback) {
    var Obj = this;
    Obj.findByIdAndRemove(id, function (err, obj) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, obj);
        }
    });
};

exports.Obj = mongoose.model('dsObjects', schema);
