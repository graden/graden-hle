var async    = require('async');
var User     = require('models/user').User;
var Cri      = require('models/cri').Cri;
var CriGroup = require('models/crigroup').CriGroup;
var Obj      = require('models/object').Obj;
var Role     = require('models/role').Role;
var Period   = require('models/period').Period;

exports.get = function(req, res, next) {
    async.parallel([
        function(callback) {
            Cri.allList(function(err, cri) {
                callback(null, cri);
            });
        },
        function(callback) {
            CriGroup.allList(function(err, crigroup) {
                callback(null, crigroup);
            });
        },
        function(callback) {
            Obj.allList(function(err, obj) {
                callback(null, obj);
            })
        },
        function(callback) {
            User.allList(function(err, user) {
                callback(null, user);
            });
        },
        function(callback) {
            Role.allList(function(err, role) {
                callback(null, role);
            });
        },
        function(callback) {
            Period.allList(function(err, period) {
                callback(null, period);
            });
        }
    ],
        function(error, results){
            if (error) {
                next(error);
            } else {
                res.render('setting.ejs',{
                    title: 'Настройка системы',
                    lstCri: results[0],
                    lstCriGroup: results[1],
                    lstCriGroupContent:  results[1][0].linkCri,
                    lstObj: results[2],
                    lstUser: results[3],
                    lstRole: results[4],
                    lstPeriod: results[5]
                });
            }
        }
    );
};

exports.permit = function(req, res) {
    res.status(200).json({url:'/setting'});
};