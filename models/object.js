var mongoose = require('libs/mongoose'),
    Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var schema = new Schema ({
    name:         {type: String, required: true},
    type:         {type: String, default: 'object'},
    permit:       {type: Boolean, default: true},
    linkSubject:  [{type: ObjectId, ref: 'dsSubject'}]
});

schema.statics.allList = function(callback) {
    var Obj = this;
    Obj.find({}).populate('linkSubject').exec(function(err, obj){
        if (err) {
            callback(err, null);
        } else {
            callback(null, obj);
        }
    });
};

schema.statics.idList = function(id, callback) {
    var Obj = this;
    if (id === '100000000000000000000001') {
        callback(null, 'Все объекты');
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

exports.Obj = mongoose.model('dsObjects', schema);