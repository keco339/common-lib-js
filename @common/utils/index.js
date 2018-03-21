
const utils = require('./lib/utils');
const TimeLogger = require('./lib/timeLogger');
const signToken = require('./lib/signToken');
const errorCodeTable = require('./lib/errorCodeTable');

exports.createUUID = utils.createUUID;
exports.getResourceUUIDInURL = utils.getResourceUUIDInURL;
exports.getLastResourceUUIDInURL = utils.getLastResourceUUIDInURL;
exports.uuid2number = utils.uuid2number;
exports.checkUUID = utils.checkUUID;


exports.isDBError = utils.isDBError;
exports.DBError = utils.DBError;
exports.errorReturn = utils.errorReturn;
exports.handlerError = utils.handlerError;
exports.Error = utils.Error;


exports.TimeLogger = TimeLogger;


exports.generateSign = signToken.generateSign;
exports.verify = signToken.verify;

exports.errorCodeTable = errorCodeTable;
