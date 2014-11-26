var async = require('async');
var AuthError = require('error').AuthError;
var mongoose = require('libs/mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema ({
    name:         {type: String, required: true},
    permit:       {type: Boolean, default: true},
    type:         {type: String, default: 'object'}
});

schema.statics.create = function(name, permit, callback) {
    var Cri = this;
    async.waterfall([
        function(callback) {
            Cri.findOne({name: name}, callback);
        },
        function(cri, callback) {
            if (cri) {
                callback(new AuthError("Такой критерий уже существует!"));
            } else {
                cri = new Cri({name: name, permit: permit});
                cri.save(function(err) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, cri);
                    }
                });
            }
        }
    ], callback);
};

schema.statics.update = function(id, name, permit, callback) {
    var Cri = this;
    Cri.findByIdAndUpdate(id, {$set: {name:name, permit:permit}}, function (err, cri) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, cri);
        }
    });
};

schema.statics.remove = function(id, callback) {
    var Cri = this;
    Cri.findByIdAndRemove(id, function (err, cri) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, cri);
        }
    });
};

schema.statics.allList = function(callback) {
    var Cri = this;
    Cri.find({}, function(err, cri){
        if (err) {
            callback(err, null);
        } else {
            callback(null, cri);
        }
    });
};

exports.Cri = mongoose.model('dsCri', schema);
