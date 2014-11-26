var crypto = require('crypto');
var async = require('async');
var AuthError = require('error').AuthError;
var mongoose = require('libs/mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var schema = new Schema({
  fullname: {type: String},
  email: {type: String},
  role: {type: ObjectId, ref: 'dsRoles'},
  username: {type: String, unique: true, required: true},
  hashedPassword: {type: String, required: true},
  salt: {type: String, required: true},
  mustChgPassword: {type: Boolean, default: false},
  created: {type: Date, default: Date.now}
});

schema.methods.encryptPassword = function(password) {
  return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

schema.virtual('password')
  .set(function(password) {
    this._plainPassword = password;
    this.salt = Math.random() + '';
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() {
        return this._plainPassword;
  });


schema.methods.checkPassword = function(password) {
  return this.encryptPassword(password) === this.hashedPassword;
};

schema.statics.authorize = function(username, password, callback) {
  var User = this;

  async.waterfall([
    function(callback) {
      User.findOne({username: username}, callback);
    },
    function(user, callback) {
      if (user) {
        if (user.checkPassword(password)) {
          callback(null, user);
        } else {
          callback(new AuthError("Пароль неверен!"));
        }
      } else {
          callback(new AuthError("Такой пользователь не существует!"));
      }
    }
  ], callback);
};

schema.statics.create = function (fullname, email, username, password, callback) {
    var User = this;
    async.waterfall([
        function(callback) {
            User.findOne({username: username}, callback);
        },
        function(user, callback) {
            if (user) {
                    callback(new AuthError("Такой пользователь уже существует!"));
            } else {
                user = new User({fullname: fullname, email: email, username: username,
                                 password: password});
                user.save(function(err) {
                    if (err) {
                       callback(err, null);
                    } else {
                       callback(null, user);
                    }
                });
            }
        }
    ], callback);
};

schema.statics.idList = function (id, callback) {
    var User = this;
    User.findById(id).populate('role').exec( function (err, user) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, user);
        }
    });
};

schema.statics.update = function (id, username, fullname, email, role, mustPassword, callback) {
    var User = this;
    User.findByIdAndUpdate(id, { $set: {username: username, fullname: fullname, email: email, role: role, mustChgPassword: mustPassword}}, function (err, user) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, user);
        }
    });
};

schema.statics.updatePassword = function (id, password, callback) {
    var User = this;

    async.waterfall([
        function(callback) {
            User.findOne({_id: id}, callback);
        },
        function(user, callback) {
            user.password = password;
            user.mustChgPassword = false;
            user.save(function(err) {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, user);
                }
            });
        }
    ], callback);
};

schema.statics.remove = function (id, callback) {
    var User = this;
    User.findByIdAndRemove(id, function (err, user) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, user);
        }
    });
};

schema.statics.allList = function(callback) {
    var User = this;
    User.find({}).populate('role').exec(function(err, user){
        if (err) {
            callback(err, null);
        } else {
            callback(null, user);
        }
    });
};

exports.User = mongoose.model('User', schema);


