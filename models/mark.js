var async    = require('async');
var mongoose = require('libs/mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var schema = new Schema ({
    createDate:   {type: Date, default: Date.now},
    modifyDate:   {type: Date, default: Date.now},
    valueMark:    {type: Number},
    valueQuarter: {type: Number},
    valueYear:    {type: Number},
    linkCriGroup: {type: ObjectId, ref: 'dsCriGroup'},
    linkCri:      {type: ObjectId, ref: 'dsCri'},
    linkObject:   {type: ObjectId, ref: 'dsObject'},
    linkType:     {type: String, default: 'true'},
    comment:      {type: String}
});

schema.statics.avgMark = function(yq, radioObj, callback) {
    var Mark  = this;
    Mark.aggregate(
        {$match:{$or:[{valueYear:yq[0].year, valueQuarter:yq[0].quarter},
            {valueYear:yq[1].year, valueQuarter:yq[1].quarter},
            {valueYear:yq[2].year, valueQuarter:yq[2].quarter},
            {valueYear:yq[3].year, valueQuarter:yq[3].quarter}
        ], linkType: radioObj , valueMark: { $gt : 0}  }},
        {$project: {valueMark:1, linkCri:1, linkCriGroup:1,
            valueQuarter:1, valueYear:1,
            linkObject: 1, linkType: 1}},
        {$group: {_id: {linkObject: "$linkObject",valueQuarter: "$valueQuarter",valueYear: "$valueYear"},
            obj: {$first: "$linkObject"},
            quarter: {$first: "$valueQuarter"},
            year: {$first: "$valueYear"},
            mark: {$sum: "$valueMark"}, count: {$sum: 1}}},
        {$sort: {valueQuarter:1, valueYear:1}}
    ).exec(function(err, mark){
        if (err) {
            callback(err, null);
        } else {

            callback(null, mark);
        }
    });
};


schema.statics.allList = function(idGrp, idQuarter, idYear, idObj, radioObj, callback) {
    var Mark = this;
    var objFind = {linkCriGroup: idGrp, valueQuarter: idQuarter, valueYear: idYear,
        linkObject: idObj, linkType: radioObj};
    if (idGrp === '100000000000000000000001' && idObj !== '100000000000000000000001') {
        objFind = {valueQuarter: idQuarter, valueYear: idYear,
            linkObject: idObj, linkType: radioObj};
    }
    if (idGrp !== '100000000000000000000001' && idObj === '100000000000000000000001') {
        objFind = {linkCriGroup: idGrp, valueQuarter: idQuarter,
            valueYear: idYear, linkType: radioObj};
    }
    if (idGrp === '100000000000000000000001' && idObj === '100000000000000000000001') {
        objFind = {valueQuarter: idQuarter, valueYear: idYear,
            linkType: radioObj};
    }
    Mark.find(objFind).exec(function (err, mark) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, mark);
        }
    });
};

schema.statics.update = function(vMark, idMark, idGrp, idCri, idQuarter, idYear, idObject, radioObj, callback) {
    var Mark = this;
    idMark = (idMark.length === 0) ? null: idMark;
    Mark.findById(idMark, function(err, fMark){
        if (!err) {
            if (!fMark) {
                fMark = new Mark({ linkCri: idCri, linkCriGroup: idGrp,
                                   valueQuarter: idQuarter, valueYear:idYear,
                                   linkObject: idObject, linkType: radioObj});
            }
            fMark.valueMark  = vMark;
            fMark.modifyDate = new Date();
            fMark.save(function(err){
               if (err) {
                   callback(err, null);
               } else {
                   callback(null, fMark);
               }
            });
        } else {
            callback(err, null);
        }
    });
};

exports.Mark = mongoose.model('dsMarks', schema);