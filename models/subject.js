var mongoose = require('libs/mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema ({
    fName:        {type: String, required: true},
    sName:        {type: String, required: true},
    tName:        {type: String, required: true},
    dateBegin:    {type: Date, default: Date.now},
    dateEnd:      {type: Date}
});

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
