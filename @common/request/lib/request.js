const rp = require('request-promise');
const _ = require('lodash');
const querystring = require('qs');

class TimeLogger{
    constructor(title) {this.title=title;}
    startTime() {
        if(this.title){console.log( `${this.title} start ...`);}
        this.startAt = process.hrtime();
    }
    endTime() {
        let _endAt = this.endAt = process.hrtime();
        let _startAt = this.startAt;
        let ms = ((_endAt[0] - _startAt[0]) * 1e3 + (_endAt[1] - _startAt[1]) * 1e-6).toFixed(3);
        if(this.title){console.log( `${this.title} end time: ${ms} ms`);}
        return ms;
    }
}

class Request{
    constructor(options){
        this.log = _.get(options,'log') || false;
    }
    get(url,qs={},options){
        options = _.extend({qs: qs, json: true, simple: false, resolveWithFullResponse: true},options);
        let that = this;

        if(this.log){
            var timeLog = new TimeLogger(`GET request URL ${url}${_.isEmpty(options.qs)?'':'?'+querystring.stringify(options.qs)}`);
            timeLog.startTime();
        }

        return rp.get(url,options).then(function ({statusCode,body,headers,request}) {
            if(that.log){
                timeLog.endTime();
            }
            return {statusCode,body,headers,request}
        })
    }
    post(url,data={},options){
        options = _.extend({body: data, json: true, simple: false, resolveWithFullResponse: true},options);
        let that = this;
        if(this.log){
            var timeLog = new TimeLogger(`POST request URL ${url}`);
            timeLog.startTime(); console.log(`body:\n${JSON.stringify(options.body,null,2)}`);
        }
        return rp.post(url,options).then(function ({statusCode,body,headers,request}) {
            if(that.log){
                timeLog.endTime();
            }
            return {statusCode,body,headers,request}
        })
    }
    put(url,data={},options){
        options = _.extend({body: data, json: true, simple: false, resolveWithFullResponse: true},options);
        let that = this;
        if(this.log){
            var timeLog = new TimeLogger(`PUT request URL ${url}`);
            timeLog.startTime(); console.log(`body:\n${JSON.stringify(options.body,null,2)}`);
        }
        return rp.put(url,options).then(function ({statusCode,body,headers,request}) {
            if(that.log){
                timeLog.endTime();
            }
            return {statusCode,body,headers,request}
        })
    }
    delete(url,qs={},options){
        options = _.extend({qs: qs,json: true, simple: false, resolveWithFullResponse: true},options);
        let that = this;
        if(this.log){
            var timeLog = new TimeLogger(`DELETE request URL ${url}${_.isEmpty(options.qs)?'':'?'+querystring.stringify(options.qs)}`);
            timeLog.startTime();
        }
        return rp.delete(url,options).then(function ({statusCode,body,headers,request}) {
            if(that.log){
                timeLog.endTime();
            }
            return {statusCode,body,headers,request}
        })
    }
}


module.exports = Request;