var mongoose = require('libs/mongoose');
var session  = require('express-session');
var MongoStore = require('connect-mongo')(session);

var sessionStore = new MongoStore({mongoose_connection: mongoose.connection, auto_reconnect: true});

module.exports = sessionStore;