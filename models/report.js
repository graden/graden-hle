var mongoose = require('libs/mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema ({
    name:         {type: String},
    permit:       {type: Boolean, default: true},
    path:         {type: String}
});


schema.statics.allList = function(callback) {
    var Rpt = this;
    Rpt.find({}, function(err, rpt){
        if (err) {
            callback(err, null);
        } else {
            callback(null, rpt);
        }
    });
}

exports.Rpt = mongoose.model('dsRpts', schema);
