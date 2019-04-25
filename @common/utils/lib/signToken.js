

const moment = require('moment');
const crypto = require('crypto');
const errorCodeTable = require('./errorCodeTable');
const _ = require('lodash');

function flatObject(obj){
    let flatObj={};
    _.mapValues(obj,(value,key)=>{
        if(_.isObject(value)){
            _.mapKeys(flatObject(value),(v,k)=>{
                flatObj[`${key}.${k}`] = v;
            });
        }
        else {
            flatObj[key] = value;
        }
    });
    return flatObj;
}

function generateSign0(key, data){
    let paramJoinStrs = _.keys(data).sort().map(key=>(`${key}=${data[key]}`)).join('&');
    let stringSignTemp=paramJoinStrs+"&key=" + key;
    let signToken = crypto.createHash('md5').update(stringSignTemp);
    let signTokenHex= signToken.digest('HEX').toUpperCase();

    return signTokenHex;
}
function generateSign(key, data){
    data = flatObject(data);
    let paramJoinStrs = _.keys(data).sort().map(key=>(`${key}=${data[key]}`)).join('&');
    let stringSignTemp=paramJoinStrs+"&key=" + key;
    let signToken = crypto.createHash('md5').update(stringSignTemp);
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
//     sn:'12345678901234562',
//     timeStamp: '1491897282566',
//     appid: 'wxd930ea5d5a258f4f',
//     mch_id: '10000100',
//     device_info: '1000',
//     body: 'test',
//     kk: 'test',
//     vs: [1,2,3],
//     vas: [{a:1},{a:2},{a:3}],
//     obj: {
//         a: 1,
//         b: {c:"a"},
//         vs: [1,2,3],
//         vas: [{a:1},{a:2},{a:3}],
//     }
// };
// let key = 'eyJ1c2VyIjp7ImhyZWYiOiJodHRwOi8vMTkyLjE2OC43LjIwMjo1MDAzL2FwaS';

// let kvs = flatObject(data);
// console.log('kvs: ', kvs);
//
// let sign0 = generateSign0(key,data);
// let sign1 = generateSign(key,data);
// console.log(sign0);
// console.log(sign1);
// console.log(sign0 === sign1);

// data.sign = generateSign(key,data);
// console.log(data.sign);
//
// console.log(verify(data.sign,key,data));
