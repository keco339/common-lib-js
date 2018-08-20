const crypto = require('crypto');
const uuid = require('uuid');
const moment = require('moment');
const _ = require('lodash');
const inflection = require('inflection');
const errorCodeTable = require('./errorCodeTable');

// UUID操作工具集
exports.createUUID = ()=>{
    let uuid_md5 = null;
    do{
        let md5 = crypto.createHash('md5');
        uuid_md5 = md5.update(`${uuid.v1()}-${uuid.v4()}`).digest('base64');
    }while( uuid_md5.indexOf('/') != -1 || uuid_md5.indexOf('+') != -1);
    return uuid_md5.substr(0, uuid_md5.length-2);
};
exports.getResourceUUIDInURL = (url,name)=>{
    let reg = new RegExp( name );
    let result = reg.exec(url);
    if( !result ) return null;
    let subStr = url.substr(result['index'] + result[0].length+1);
    result = (new RegExp('/')).exec(subStr);
    if(!result) return subStr;
    subStr = subStr.substr(0,result['index']);
    return subStr;
};
exports.getResourceTypeInURL = (url)=>{
    const resourceObjReg = /\/([\w]+)\/[\w]{22}$/;
    let ret = resourceObjReg.exec(url);
    if(!ret){ return null;}
    return inflection.singularize(ret[1]);
};
exports.getLastResourceUUIDInURL = (url)=>{
    let reg = /\/[\w]{22}$/;
    let result = reg.exec(url);
    if( !result ) return null;
    return result[0].substr(1);
};
exports.uuid2number = (uuid)=>{
    let number = Array.from(uuid).reduce((ret,char,i)=>{
        return ret + (char.charCodeAt(0)-"0".charCodeAt(0))*Math.pow(2,(i%19+1));
    },0);
    return _.padStart(number,8,'0');
};

const UUIDReg = new RegExp('[a-z0-9A-Z]{22}');
exports.checkUUID = (uuid)=>{return UUIDReg.test(uuid)?true:false;};
exports.checkRequiredParams = (obj, keys)=>{
    let error = null;
    let s = keys.some( key =>{
        if( !_.has(obj,key)){
            error = new Error();
            error.name = 'Error'; error.status = 400;
            error.code = errorCodeTable.missingParam2Code( key );
            error.message = errorCodeTable.errorCode2Text( error.code );
            error.description = `Missing param '${key}'`;
            return true;
        }
    });
    if(error) throw error;
};


// Error 错误处理工具集
exports.isDBError = (error)=>error && error.code && error.errno && _.has(error, 'sql');
exports.DBError = (error)=>_.extend(error,{
    name: 'DBError',
    statusCode: 500,
    code: 5100,
    message:'Database server instruction execution fail.',
    description: `${error.code}(${error.errno} ${error.message}`
});
exports.errorReturn = (error)=>{
    if(!error){return {name:'Error',statusCode:500,code:9999,message:'Unknown Error',description:'',stack: (new Error()).stack};}
    if(error.isBoom){
        let data = error.data;
        let payload = error.output.payload;
        return {
            name : payload.error || 'Error',
            statusCode: payload.statusCode || 500,
            code : _.get(data,'code') ||9999,
            message :  payload.message || payload.error|| 'Unknown Error',
            description : _.get(data,'description') || "",
            stack : (error.stack) ? error.stack : 'no stack'
        };
    }
    else {
        return {
            name : ((error && error.name) ? error.name:'Error'),
            statusCode: error.statusCode || 500,
            code : ((error && error.code) ? error.code:9999),
            message : ((error &&error.message) ? error.message : 'Unknown Error'),
            description : ((error &&error.description) ? error.description : ''),
            stack : ((error&&error.stack) ? error.stack : 'no stack')
        };
    }
};
exports.handlerError = (rtx,error)=>{
    console.error(error);
    error = exports.isDBError(error)?exports.DBError(error):error;
    rtx.body =   exports.errorReturn(error);
    rtx.status = rtx.body.statusCode || 500;

};

exports.Error = (name,status,code,description)=>{
    let error = new Error();
    error.name = name || 'Error';
    error.status = status || 500;
    error.code = code || 9999;
    error.message = errorCodeTable.errorCode2Text(error.code);
    error.description = description || error.message;
    throw error;
};
