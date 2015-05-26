var async     = require('async');
var AuthError = require('error').AuthError;
var mongoose  = require('libs/mongoose');
var Schema    = mongoose.Schema;

var schema = new Schema ({
    createDate:      {type: Date, default: Date.now},
    modifyDate:      {type: Date, default: Date.now},
    codeDirGroups:   {type: Number}, //0 - CIO, 1 - rc, 2 - direct, 3 - office
    nameDirGroups:   {type: String},
    permit:          {type: Boolean}
});

schema.statics.allList = function(callback) {
    var DirGroups = this;
    DirGroups.find({}, function(err, period){
        if (err) {
            callback(err, null);
        } else {
            callback(null, period);
        }
    });
};

schema.statics.create = function(name, code, permit, callback) {
    var DirGroups = this;
    async.waterfall([
        function(callback) {
            DirGroups.findOne({code: code}, callback);
        },
        function(p, callback) {
            if (p) {
                callback(new AuthError("Такая группа уже существует!"));
            } else {
                p = new DirGroups({nameDirGroups: name, codeDirGroups: code, permit: permit});
                p.save(function(err) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, p);
                    }
                });
            }
        }
    ], callback);
};

schema.statics.update = function(id, name, desc, count, code, permit, callback) {
    var DirGroups = this;
    DirGroups.findByIdAndUpdate(id, {$set: {nameDirGroups: name, codeDirGroups: code, permit: permit,
                                            modifyDate: new Date()}}, function (err, p) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, p);
        }
    });
};

schema.statics.remove = function(id, callback) {
    var DirGroups = this;
    DirGroups.findByIdAndRemove(id, function (err, p) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, p);
        }
    });
};



exports.DirGroups = mongoose.model('dsDirGroups', schema);
