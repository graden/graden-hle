var mongoose   = require('libs/mongoose');
var Schema     = mongoose.Schema;
var async      = require('async');
var AuthError  = require('error').AuthError;

var schema = new Schema ({
    fName:        {type: String, required: true},
    sName:        {type: String, required: true},
    tName:        {type: String, required: true},
    dateBegin:    {type: Date, default: Date.now},
    dateEnd:      {type: Date}
});

schema.statics.create = function(fName, sName, tName, dateEnd, callback) {
    var Sbj = this;
    async.waterfall([
        function(callback) {
            Sbj.findOne({}, {}, { sort: { 'dateBegin' : -1 } }, callback);
        },
        function(sbj, callback) {
            if (sbj) {
                sbj.dateEnd = Date.now();
                sbj.save();
            }
            sbj = new Sbj({fName: fName, sName: sName, tName: tName});
            sbj.save(function(err) {
                if (err) {
                    callback(err, null);
                } else {
                    console.log(sbj);
                    callback(null, sbj);
                }
            });
        }
    ], callback);

};

schema.statics.update = function(id, fName, sName, tName, dateEnd, callback) {
    var Sbj = this;

    Sbj.findByIdAndUpdate(id, { $set: { fName: fName, sName: sName, tName: tName }}, function (err, sbj) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, sbj);
        }
    });
};

schema.statics.allList = function(callback) {
    var Subject = this;
    Subject.find({}, function(err, subject){
        if (err) {
            callback(err, null);
        } else {
            callback(null, subject);
        }
    });
};

schema.statics.idList = function(id, callback) {
    var Subject = this;
    Subject.findById(id, function(err, subject){
        if (err) {
            callback(err, null);
        } else {
            callback(null, subject);
        }
    });
};

exports.Subject = mongoose.model('dsSubject', schema);
