var log4js = require('log4js');
//var logger = log4js.getLogger('hle');

function Logger() {
   return new log4js.getLogger('hle');
}

module.exports = Logger;