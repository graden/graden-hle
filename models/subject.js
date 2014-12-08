var mongoose   = require('libs/mongoose');
var Schema     = mongoose.Schema;
var ObjectId   = Schema.Types.ObjectId;
var async      = require('async');
var AuthError  = require('error').AuthError;
var df         = require('libs/libDate');

var schema = new Schema ({
    idObj:        {type: ObjectId},
    fName:        {type: String, required: true},
    sName:        {type: String, required: true},
    tName:        {type: String, required: true},
    dateBegin:    {type: Date, default: Date.now},
    dateEnd:      {type: Date}
});

schema.statics.create = function(idObj, fName, sName, tName, dateEnd, callback) {
    var Sbj = this;
    async.waterfall([
        function(callback) {
            Sbj.findOne({fName: fName}, callback);
        },
        function(sbj, callback) {
            if (sbj) {
                callback(new AuthError("Такой субъект уже существует!"));
            } else {
                sbj = new Sbj({idObj: idObj, fName: fName, sName: sName, tName: tName, dateEnd: dateEnd});
                sbj.save(function(err) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, sbj);
                    }
                });
            }
        }
    ], callback);
};

schema.statics.update = function(id, fName, sName, tName, dateEnd, callback) {
    var Sbj = this;
    Sbj.findByIdAndUpdate(id, { $set: {fName: fName, sName: sName, tName: tName, dateEnd: dateEnd }}, function (err, sbj) {
        if (!sbj) {
            callback(new AuthError("Нет данных для изменения!"))
        } else {
            if (err) {
                callback(err, null);
            } else {
                callback(null, sbj);
            }
        }
    });
};

schema.statics.remove  = function(id, callback) {
    var Sbj = this;
    Sbj.findByIdAndRemove(id, function (err, sbj) {
        if (!sbj) {
            callback(new AuthError("Нет данных для удаления!"))
        } else {
            if (err) {
                callback(err, null);
            } else {
                callback(null, sbj);
            }
        }
    });
};

schema.statics.list = function(idObj, callback) {
    var Sbj = this;
    Sbj.find({idObj:idObj}).sort({ 'dateBegin': 1 }).exec(function(err, sbj){
        if (err) {
            callback(err, null);
        } else {
            callback(null, sbj);
        }
    });
};

schema.statics.idList = function(vQuarter, vYear, callback) {
    var Sbj = this;
    //var fromDate = new Date(vYear,(vQuarter*3)-3, 1);
    //var toDate   = new Date(vYear,(vQuarter*3)-1, df.getLastDayInMonth(vYear,(vQuarter*3)-1));
    //console.log('q= ', vQuarter , vYear, df.getLastDayInMonth(2014,11));
    //console.log('date= ',fromDate, toDate);
    Sbj.aggregate(/*{$match:{dateBegin:{$gte: fromDate, $lt: toDate}}},*/
        {$project: {fName:1, sName:1, tName:1, idObj:1, dateBegin:1, dateEnd:1}
        },
        {$group: {_id: "$idObj",
                fName: {$last: "$fName"},
                sName: {$last: "$sName"},
                tName: {$last: "$tName"},
            dateBegin: {$last: "$dateBegin"},
              dateEnd: {$last: "$dateEnd"}
        }
    }).exec(function(err, sbj){
        if (err) {
            callback(err, null);
        } else {
            callback(null, sbj);
        }
    });

};

exports.Subject = mongoose.model('dsSubjects', schema);
