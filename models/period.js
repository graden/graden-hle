var async    = require('async');
var mongoose = require('libs/mongoose');
var Schema   = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var schema = new Schema ({
    createDate:   {type: Date, default: Date.now},
    modifyDate:   {type: Date, default: Date.now},
    txtPeriod:    {type: String},
    fullPeriod:   {type: String},
    repeatPeriod: {type: Number}
});

exports.Period = mongoose.model('dsPeriods', schema);
