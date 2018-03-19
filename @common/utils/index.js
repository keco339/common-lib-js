
const utils = require('./lib/utils');
const TimeLogger = require('./lib/timeLogger');

exports.createUUID = utils.createUUID;
exports.getResourceUUIDInURL = utils.getResourceUUIDInURL;
exports.getLastResourceUUIDInURL = utils.getLastResourceUUIDInURL;


exports.isDBError = utils.isDBError;
exports.DBError = utils.DBError;
exports.errorReturn = utils.errorReturn;


exports.TimeLogger = TimeLogger;