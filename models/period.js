var async    = require('async');
var mongoose = require('libs/mongoose');
var Schema   = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var schema = new Schema ({
    createDate:   {type: Date, default: Date.now},
    modifyDate:   {type: Date, default: Date.now},
    name:         {type: String},
    fullPeriod:   {type: String},
    repeatPeriod: {type: Number},
    permit:       {type: Boolean}
});

schema.statics.create = function(name, fullPeriod, repeatPeriod, permit, callback) {
    var Period = this;
    async.waterfall([
        function(callback) {
            Period.findOne({name: name}, callback);
        },
        function(period, callback) {
            if (period) {
                callback(new AuthError("Такая периодичность уже существует!"));
            } else {
                period = new Period({name: name, fullPeriod: fullPeriod, repeatPeriod: repeatPeriod ,permit: permit});
                period.save(function(err) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, period);
                    }
                });
            }
        }
    ], callback);
};

schema.statics.update = function(id, name, fullPeriod, repeatPeriod, permit, callback) {
    var Period = this;
    Period.findByIdAndUpdate(id, {$set: {name: name, fullPeriod: fullPeriod, repeatPeriod: repeatPeriod ,permit: permit}}, function (err, cri) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, cri);
        }
    });
};

schema.statics.remove = function(id, callback) {
    var Period = this;
    Period.findByIdAndRemove(id, function (err, cri) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, cri);
        }
    });
};



exports.Period = mongoose.model('dsPeriods', schema);
