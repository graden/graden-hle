var express = require('express');
var session  = require('express-session');
var cookieParser = require('cookie-parser');
var favicon = require('serve-favicon');
var log4js = require('log4js');
var bodyParser = require('body-parser');
var url = require('url');
var config  = require('config');
var logs  = require('libs/logs')('CON');
var HttpError = require('error').HttpError;
var checkAuth = require('middleware/checkAuth');
var checkPermit = require('middleware/checkPermit');
var port = process.env.port || config.get('port');
var app = express();

app.listen(port, function(){
    logs.warn('%s - %s: %s','robot','Starting the server on port',port);
});

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(log4js.connectLogger(logs, { level: 'auto' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());


var sessionStore = require('libs/sessionStore');
var ejsTemplate  = require('ejs-locals');

app.use(session({
    secret: config.get('session:secret'),
    key: config.get('session:key'),
    cookie: config.get('session:cookie'),
    store: sessionStore,
    proxy: true,
    resave: true,
    saveUninitialized: true
}));

app.use(require('middleware/sendHttpError'));
app.use(require('middleware/loadUser'));

app.engine('ejs', ejsTemplate);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/vendor'));


app.use(function (req, res, next) {
    var user = (!req.session.username) ? 'robot': req.session.username;
    var ipAddr = (req.headers['x-forwarded-for'] || '').split(',')[0] || req.connection.remoteAddress;
    logs.info('%s - %s - %s', user, ipAddr, req.url);
    next();
});

app.get('/login', require('routes/logins').get);
app.post('/login', require('routes/logins').post);
app.get('/logout', require('routes/logouts').get);

app.post('/user/create', require('routes/users').create);
app.post('/user/update', require('routes/users').update);
app.post('/user/remove', require('routes/users').remove);
app.post('/user/update/password', require('routes/users').updatePassword);

//app.post('/role/object/list', require('routes/objects').list);
app.post('/role/object/add', require('routes/roles').addObj);
app.post('/role/group/add', require('routes/roles').addGrp);
app.post('/role/object/remove', require('routes/roles').removeObj);
app.post('/role/group/remove', require('routes/roles').removeGrp);
app.post('/role/create', require('routes/roles').create);
app.post('/role/load', require('routes/roles').load);
app.get('/role/list', require('routes/roles').list);
app.post('/role/update', require('routes/roles').update);
//app.post('/role/remove', require('routes/roles').remove);

app.get('/setting',checkPermit.setting, require('routes/settings').get);
app.get('/setting/permit',checkPermit.setting, require('routes/settings').permit);
app.post('/reports/repo2', require('routes/reports').report2);
app.get('/download', require('routes/reports').download);

app.get('/home', checkAuth, require('routes/homes').first);
app.get('/', checkAuth, require('routes/homes').redi);
app.post('/home/update', checkAuth, require('routes/homes').update);
app.post('/mark/update',checkPermit.permitMark, require('routes/marks').update);

app.get('/crigroup/list', require('routes/crigroups').list);
app.get('/crigroup/listRole', require('routes/crigroups').listRole);
app.post('/crigroup/create', require('routes/crigroups').create);
app.post('/crigroup/update', require('routes/crigroups').update);
app.post('/crigroup/remove', require('routes/crigroups').remove);

app.get('/object/list', require('routes/objects').list);
app.get('/object/listRole', require('routes/objects').listRole);
app.post('/object/create', require('routes/objects').create);
app.post('/object/update', require('routes/objects').update);
app.post('/object/remove', require('routes/objects').remove);

app.post('/subject/create', require('routes/subjects').create);

app.post('/task/create',checkPermit.createTask, require('routes/tasks').create);
app.post('/task/load',checkAuth, require('routes/tasks').load);
app.post('/task/update', checkPermit.editTask, require('routes/tasks').update);
app.post('/task/remove', checkPermit.removeTask, require('routes/tasks').remove);

app.post('/cri/create', require('routes/cris').create);
app.post('/cri/update', require('routes/cris').update);
app.post('/cri/remove', require('routes/cris').remove);

app.post('/crigroupcontent/choice', require('routes/crigroupcontents').choice);
app.post('/crigroupcontent/list', require('routes/crigroupcontents').list);
app.post('/crigroupcontent/add', require('routes/crigroupcontents').addLinkCri);
app.post('/crigroupcontent/remove', require('routes/crigroupcontents').removeLinkCri);


app.use(function(err, req, res, next) {
    if (typeof err == 'number') {
        err = new HttpError(err);
    }
    if (err instanceof HttpError) {
        logs.error(err);
        res.sendHttpError(err);
    } else {
        logs.error(err);
        err = new HttpError(500);
        res.sendHttpError(err);
    }
});
