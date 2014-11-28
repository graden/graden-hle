var log4js   = require('log4js');

function Logger(a) {
   log4js.configure({
      appenders: [
         { type: 'console', category: 'CON' },
         { type: 'file', filename: 'hle.log', category: 'FIL' }
      ]
   });
   return new log4js.getLogger(a);
}

module.exports = Logger;