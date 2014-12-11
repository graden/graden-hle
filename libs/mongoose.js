var mongoose = require('mongoose');
var config = require('config');

if(process.env.VCAP_SERVICES){
    var env = JSON.parse(process.env.VCAP_SERVICES);
    console.log('env= ', env);
    var mongoFog = env['mongodb2-2.4.8'][0]['credentials'];
    console.log('cred=',mongoFog);
    var uriFog = '';
    if(mongoFog.username && mongoFog.password){
        uriFog = "mongodb://" + mongoFog.username + ":" +
                                mongoFog.password + "@" +
                                mongoFog.hostname + ":" +
                                mongoFog.port + "/" +
                                mongoFog.db;
    }
    else{
        uriFog = "mongodb://" + mongoFog.hostname + ":" +
                                mongoFog.port + "/" +
                                mongoFog.db;
    }
    //mongoose.connect(uriFog, config.get('mongoose:options'));
    mongoose.connect(config.get('mongoose:uri'), config.get('mongoose:options'));
} else {
    mongoose.connect(config.get('mongoose:uri'), config.get('mongoose:options'));
}

module.exports = mongoose;
