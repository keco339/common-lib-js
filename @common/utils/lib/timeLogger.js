
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

module.exports = TimeLogger;