var async    = require('async');
var mongoose = require('libs/mongoose');
var Schema   = mongoose.Schema;

var schema = new Schema ({
    createDate:   {type: Date, default: Date.now},
    modifyDate:   {type: Date, default: Date.now},
    codePeriod:   {type: Number}, //0 - days, 1 - weeks, 2 - months, 3 - years
    namePeriod:   {type: String},
    descPeriod:   {type: String},
    countPeriod:  {type: Number},
    permit:       {type: Boolean}
});

schema.statics.allList = function(callback) {
    var Period = this;
    Period.find({}, function(err, period){
        if (err) {
            callback(err, null);
        } else {
            callback(null, period);
        }
    });
};

schema.statics.create = function(name, desc, count, code, permit, callback) {
    var Period = this;
    async.waterfall([
        function(callback) {
            Period.findOne({codePeriod: code}, callback);
        },
        function(period, callback) {
            if (period) {
                callback(new AuthError("Такая периодичность уже существует!"));
            } else {
                period = new Period({namePeriod: name, descPeriod: desc, countPeriod: count, codePeriod: code, permit: permit});
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

schema.statics.update = function(id, name, desc, count, code, permit, callback) {
    var Period = this;
    Period.findByIdAndUpdate(id, {$set: {namePeriod: name, descPeriod: desc, countPeriod: count,
                                  codePeriod: code, permit: permit, modifyDate: new Date()}}, function (err, period) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, period);
        }
    });
};

schema.statics.remove = function(id, callback) {
    var Period = this;
    Period.findByIdAndRemove(id, function (err, period) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, period);
        }
    });
};



exports.Period = mongoose.model('dsPeriods', schema);
