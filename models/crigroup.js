var async = require('async');
var AuthError = require('error').AuthError;
var HleFunc  = require('libs/func-hle');
var mongoose = require('libs/mongoose'),
    Schema = mongoose.Schema;

var ObjectId = Schema.Types.ObjectId;
var schema = new Schema ({
    name:         {type: String, required: true},
    permit:       {type: Boolean, default: true},
    linkCri:      [{type: ObjectId, ref: 'dsCri'}],
    linkSbj:      [{type: ObjectId, ref: 'dsCri'}],
    grpDirect:    {type: Number, default: 3}
});

schema.statics.allList = function(callback) {
    var CriGroup = this;
    CriGroup.find({}).sort({name: 1}).populate('linkCri').exec(function(err, crigroup){
        if (err) {
            callback(err, null);
        } else {
            callback(null, crigroup);
        }
    });
};

schema.statics.allListRep = function(grp, callback) {
    var CriGroup = this;
    CriGroup.find({'grpDirect': grp}).sort({name: 1}).populate('linkCri').exec(function(err, crigroup){
        if (err) {
            callback(err, null);
        } else {
            callback(null, crigroup);
        }
    });
};

schema.statics.allListPlus = function(callback) {
    var CriGroup = this;
    var a = {};
    CriGroup.find({}).sort({name: 1}).populate('linkCri').exec(function(err, crigroup){
        if (err) {
            callback(err, null);
        } else {
            a._id = '100000000000000000000001';
            a.name = 'Все';
            a.permit = true;
            crigroup.push(a);
            callback(null, crigroup);
        }
    });
};

schema.statics.allLinkCri= function(callback) {
    var CriGroup = this;
    var linkCri = {};
    CriGroup.find({}).sort({name: 1}).populate('linkCri').populate('linkSbj').exec(function(err, crigroup){
        if (err) {
            callback(err, null);
        } else {
            callback(null, crigroup);
        }
    });
};

schema.statics.idList = function(arrayGrp, id, typeObj, callback) {
    var CriGroup = this;
    if (typeObj === 'true') {
        if (id === '100000000000000000000001') {
            CriGroup.find({_id: {$in:arrayGrp}}).sort({name: 1}).populate('linkCri').exec(function(err, crigroup){
                var obj = [];
                if (err) {
                    callback(err, null);
                } else {
                    crigroup.forEach(function(cg){
                        for(var i = 0; i < cg.linkCri.length; i++) {
                            cg.linkCri[i].name = cg.linkCri[i].name + ' (' + cg.name + ')';
                            obj.push(cg.linkCri[i]);
                        }
                    });
                    callback(null, HleFunc.removeDuplicates(obj));
                }
            });
        } else {
            CriGroup.findOne({_id: id}).sort({name: 1}).populate('linkCri').exec(function(err, crigroup){
                if (crigroup) {
                    callback(null, crigroup.linkCri);
                } else {
                    callback(null, null);
                }
            });
        }
    } else {
        if (id === '100000000000000000000001') {
            CriGroup.find({_id: {$in:arrayGrp}}).sort({name: 1}).populate('linkSbj').exec(function(err, crigroup){
                var obj = [];
                if (err) {
                    callback(err, null);
                } else {
                    crigroup.forEach(function(cg){
                        for(var i = 0; i < cg.linkSbj.length; i++) {
                            obj.push(cg.linkSbj[i]);
                        }
                    });
                    callback(null, HleFunc.removeDuplicates(obj));
                }
            });
        } else {
            CriGroup.findOne({_id: id}).sort({name: 1}).populate('linkSbj').exec(function(err, crigroup){
                if (crigroup) {
                    callback(null, crigroup.linkSbj);
                } else {
                    callback(null, null);
                }
            });
        }
    }
};

schema.statics.addLinkCri = function(id, idCri, typeObj, callback) {
    var CriGroup = this;
    if (typeObj === 'true') {
        CriGroup.findByIdAndUpdate(id, { $pushAll: { linkCri: [idCri]} }, function (err, crigroup) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, crigroup);
            }
        });
    }  else {
        CriGroup.findByIdAndUpdate(id, { $pushAll: { linkSbj: [idCri]} }, function (err, crigroup) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, crigroup);
            }
        });
    }
};

schema.statics.removeLinkCri = function(id, idCri, typeObj, callback) {
    var CriGroup = this;
    if (typeObj === 'true') {
        CriGroup.findByIdAndUpdate(id, { $pullAll: {linkCri: [idCri]} }, function (err, crigroup) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, crigroup);
            }
        });
    } else {
        CriGroup.findByIdAndUpdate(id, { $pullAll: {linkSbj: [idCri]} }, function (err, crigroup) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, crigroup);
            }
        });
    }
};

schema.statics.create = function(name, permit, callback) {
    var CriGroup = this;
    async.waterfall([
        function(callback) {
            CriGroup.findOne({name: name}, callback);
        },
        function(crigroup, callback) {
            if (crigroup) {
                callback(new AuthError("Такая группа уже существует!"));
            } else {
                crigroup = new CriGroup({name: name, permit: permit});
                crigroup.save(function(err) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, crigroup);
                    }
                });
            }
        }
    ], callback);
};

schema.statics.update = function(id, name, permit, callback) {
    var CriGroup = this;
    CriGroup.findByIdAndUpdate(id, { $set: { name: name, permit: permit }}, function (err, crigroup) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, crigroup);
        }
    });
};

schema.statics.verif = function(id, callback) {
    var CriGroup = this;
    async.parallel([
        function(cb) {
            CriGroup.find({linkCri:id}).select('name').exec(function(err, linkcri){
                cb(null, linkcri);
            });
        },
        function(cb) {
            CriGroup.find({linkSbj:id}).select('name').exec(function(err, linksbj){
                cb(null, linksbj);
            });
        }
    ],
        function(error, results) {
            if (error) {
                callback(error, null);
            } else {
                if (!results[0].length || !results[1].length) {
                    callback(null, true);
                } else {
                    callback(new AuthError("Нельзя удалить критерий, который используется в группе!"));
                }
            }
        }
    );
};

schema.statics.remove  = function(id, callback) {
    var CriGroup = this;
    CriGroup.findByIdAndRemove(id, function (err, crigroup) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, crigroup);
        }
    });
};

exports.CriGroup = mongoose.model('dsCriGroups', schema);