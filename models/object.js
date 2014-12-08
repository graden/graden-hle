var async = require('async');
var mongoose = require('libs/mongoose');
var Schema = mongoose.Schema;
var schema = new Schema ({
    name:         {type: String, required: true},
    type:         {type: String, default: 'object'},
    permit:       {type: Boolean, default: true}
});

schema.statics.allList = function(callback) {
    var Obj = this;
    Obj.find({}).exec(function(err, obj){
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

schema.statics.create = function(name, type, permit, callback) {
    var Obj = this;
    async.waterfall([
        function(callback) {
            Obj.findOne({name: name}, callback);
        },
        function(obj, callback) {
            if (obj) {
                callback(new AuthError("Такой объект уже существует!"));
            } else {
                obj = new Obj({name: name, type: type, permit: permit});
                obj.save(function(err) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, obj);
                    }
                });
            }
        }
    ], callback);
};

schema.statics.update = function(id, name, type, permit, callback) {
    var Obj = this;
    Obj.findByIdAndUpdate(id, { $set: { name: name, type: type, permit: permit }}, function (err, obj) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, obj);
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