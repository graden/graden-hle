var async    = require('async');
var mongoose = require('libs/mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var schema = new Schema ({
    createDate:    {type: Date, default: Date.now},
    modifyDate:    {type: Date, default: Date.now},
    createUser:    {type: ObjectId, ref: 'dsUsers'},
    modifyUser:    {type: ObjectId, ref: 'dsUsers'},
    typePeriod:    {type: Number},
    typeDirGroups: {type: Number},
    valueMark:     {type: Number},             //Оценка направ.(группа 0)
    valueMark1:    {type: Number, default: 0}, //Самооценка (группа 0)
    valueMark2:    {type: Number, default: 0}, //Оценка др. направлений (группа 0)
    valueMark3:    {type: Number, default: 0}, //Оценка директора РЦ (группа 1)
    valueMark4:    {type: Number, default: 0},
    valueMark5:    {type: Number, default: 0},
    valueMark6:    {type: Number, default: 0},
    valueMark7:    {type: Number, default: 0},
    valueMark8:    {type: Number, default: 0},
    valueMark9:    {type: Number, default: 0},
    valueQuarter:  {type: Number},
    valueYear:     {type: Number},
    linkCriGroup:  {type: ObjectId, ref: 'dsCriGroup'},
    linkCri:       {type: ObjectId, ref: 'dsCri'},
    linkObject:    {type: ObjectId, ref: 'dsObject'},
    linkType:      {type: String, default: 'true'},
    comment:       {type: String}
});

schema.statics.avgMark = function(yq, radioObj, callback) {
    var Mark  = this;
    Mark.aggregate(
        {$match:{$or:[{valueYear:yq[0].year, valueQuarter:yq[0].quarter},
                      {valueYear:yq[1].year, valueQuarter:yq[1].quarter},
                      {valueYear:yq[2].year, valueQuarter:yq[2].quarter},
                      {valueYear:yq[3].year, valueQuarter:yq[3].quarter}],
                 linkType: radioObj, valueMark: { $gt : 0}}},
        {$project: {valueMark:1, linkCri:1, linkCriGroup:1, valueQuarter:1, valueYear:1, linkObject: 1, linkType: 1}},
        {$group: {_id: {linkObject: "$linkObject",
                        valueQuarter: "$valueQuarter",
                        valueYear: "$valueYear"},
            obj: {$first: "$linkObject"},
            quarter: {$first: "$valueQuarter"},
            year: {$first: "$valueYear"},
            mark: {$sum: "$valueMark"},
            count: {$sum: 1},
            type: {$first: "$linkType"}
        }},
        {$sort: {valueQuarter:1, valueYear:1}}
    ).exec(function(err, mark){
        if (err) {
            callback(err, null);
        } else {
            callback(null, mark);
        }
    });
};

schema.statics.avgMarkCri = function(yq, idObj, radioObj, callback) {
    var Mark  = this;
    Mark.aggregate(
        {$match:{$or:[{valueYear:yq[0].year, valueQuarter:yq[0].quarter},
            {valueYear:yq[1].year, valueQuarter:yq[1].quarter},
            {valueYear:yq[2].year, valueQuarter:yq[2].quarter},
            {valueYear:yq[3].year, valueQuarter:yq[3].quarter}],
            linkType: radioObj, linkObject: mongoose.Types.ObjectId(idObj), valueMark: { $gt : 0}}},
        {$project: {valueMark:1, linkCri:1, linkCriGroup:1, valueQuarter:1, valueYear:1, linkObject: 1, linkType: 1}},
        {$group: {_id: {linkCri: "$linkCri",
                        valueQuarter: "$valueQuarter",
                        valueYear: "$valueYear"},
                cri: {$first: "$linkCri"},
                obj: {$first: "$linkObject"},
                quarter: {$first: "$valueQuarter"},
                year: {$first: "$valueYear"},
                mark: {$sum: "$valueMark"},
                count: {$sum: 1},
                type: {$first: "$linkType"}
        }},
        {$sort: {linkCriGroup:1, valueQuarter:1, valueYear:1}}
    ).exec(function(err, mark){
        if (err) {
            callback(err, null);
        } else {
            callback(null, mark);
        }
    });
};

schema.statics.avgMarkObj = function(yq, idObj, radioObj, callback) {
    var Mark  = this;
    Mark.aggregate(
        {$match:{$or:[{valueYear:yq[0].year, valueQuarter:yq[0].quarter},
            {valueYear:yq[1].year, valueQuarter:yq[1].quarter},
            {valueYear:yq[2].year, valueQuarter:yq[2].quarter},
            {valueYear:yq[3].year, valueQuarter:yq[3].quarter}],
            linkType: radioObj, linkObject: mongoose.Types.ObjectId(idObj), valueMark: { $gt : 0}}},
        {$project: {valueMark:1, linkCri:1, linkCriGroup:1, valueQuarter:1, valueYear:1, linkObject: 1, linkType: 1}},
        {$group: {_id: {linkCriGroup: "$linkCriGroup",
            valueQuarter: "$valueQuarter",
            valueYear: "$valueYear"},
            group: {$first: "$linkCriGroup"},
            obj: {$first: "$linkObject"},
            quarter: {$first: "$valueQuarter"},
            year: {$first: "$valueYear"},
            mark: {$sum: "$valueMark"},
            count: {$sum: 1},
            type: {$first: "$linkType"}
        }},
        {$sort: {linkCriGroup:1, valueQuarter:1, valueYear:1}}
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

schema.statics.update = function(vMark, vMark1, vMark2, vMark3, vMark4, vMark5, vMark6, vMark7, vMark8, vMark9,
                                 idMark, idGrp, idCri, idQuarter, idYear, idObject, radioObj, typeDirGroups, callback) {
    var Mark = this;
    idMark = (idMark.length === 0) ? null: idMark;
    Mark.findById(idMark, function(err, fMark){
        if (!err) {
            if (!fMark) {
                fMark = new Mark({ linkCri: idCri, linkCriGroup: idGrp, valueQuarter: idQuarter, valueYear:idYear,
                                   linkObject: idObject, linkType: radioObj, typeDirGroups: typeDirGroups  });
            }

            fMark.valueMark   = vMark;
            fMark.valueMark1  = vMark1;
            fMark.valueMark2  = vMark2;
            fMark.valueMark3  = vMark3;
            fMark.valueMark4  = vMark4;
            fMark.valueMark5  = vMark5;
            fMark.valueMark6  = vMark6;
            fMark.valueMark7  = vMark7;
            fMark.valueMark8  = vMark8;
            fMark.valueMark9  = vMark9;
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