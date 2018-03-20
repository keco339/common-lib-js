

const moment = require('moment');
const crypto = require('crypto');
const errorCodeTable = require('./errorCodeTable');
const _ = require('lodash');


function generateSign(key, data){
    let paramJoinStrs = _.keys(data).sort().map(key=>(`${key}=${data[key]}`)).join('&');
    let stringSignTemp=paramJoinStrs+"&key=" + key;

    let signToken = crypto.createHash('md5')
        .update(stringSignTemp);
    let signTokenHex= signToken.digest('HEX').toUpperCase();

    return signTokenHex;
}

function verify(sign, key, data ){
    let newData = _.omit(data, ['sign']);
    let serverSign = generateSign(key, newData);
    if(serverSign != sign.toUpperCase()){
        let error = new Error();
        error.name = 'Error'; error.status = 401; error.code = 1053;
        error.message = errorCodeTable.errorCode2Text(error.code);
        error.description = 'Sign Authorization Fail!!!';
        throw error;
    }
    return true;
}


module.exports = {
    generateSign: generateSign,
    verify: verify
};

// let data = {
//     sn:'1234567890123456',
//     timeStamp: '1491897282566',
//     appid: 'wxd930ea5d5a258f4f',
//     mch_id: '10000100',
//     device_info: '1000',
//     body: 'test',
// };
// let key = 'eyJ1c2VyIjp7ImhyZWYiOiJodHRwOi8vMTkyLjE2OC43LjIwMjo1MDAzL2FwaS';
//
// data.sign = generateSign(key,data);
// console.log(data.sign);
//
// console.log(verify(data.sign,key,data));