exports.quaterRome = function(arabic) {
    var r = '';
    if (arabic == 1) {r = 'I';}
    if (arabic == 2) {r = 'II';}
    if (arabic == 3) {r = 'III';}
    if (arabic == 4) {r = 'IV';}
    return r;
};

exports.removeDuplicates = function(vals) {
    var res = [];
    var tmp = vals.sort();
    for (var i = 0; i < tmp.length; i++) {
        res.push(tmp[i]);
        while (JSON.stringify(tmp[i]) == JSON.stringify(tmp[i + 1])) {
            i++;
        }
    }
    return res;
};

exports.unique = function(arr) {
    var obj = {};
    for(var i=0; i<arr.length; i++) {
        var str = arr[i];
        obj[str] = true;
    }
    return Object.keys(obj);
};

exports.dateFormat = function(date, fstr, utc) {
    utc = utc ? 'getUTC' : 'get';
    return fstr.replace (/%[YmdHMS]/g, function (m) {
        switch (m) {
            case '%Y': return date[utc + 'FullYear'] (); // no leading zeros required
            case '%m': m = 1 + date[utc + 'Month'] (); break;
            case '%d': m = date[utc + 'Date'] (); break;
            case '%H': m = date[utc + 'Hours'] (); break;
            case '%M': m = date[utc + 'Minutes'] (); break;
            case '%S': m = date[utc + 'Seconds'] (); break;
            default: return m.slice (1); // unknown code, remove %
        }
        // add leading zero if required
        return ('0' + m).slice (-2);
    });
};

exports.nowQY = function() {
    var a = {};
    var defDate = new Date();
    a.quarter = Number((defDate.getMonth()/3).toFixed(0));
    a.year = defDate.getFullYear();
    return a;
};

exports.prevQY = function(radioObj, defQuarter, defYear) {
    var a = {};
    a.quarter = defQuarter;
    a.year = defYear;
    if (radioObj === 'true') {
        if (a.quarter > 1) {
            a.quarter -= 1;
        }  else {
            a.quarter = 4;
            a.year -= 1;
        }
    } else {
        if (a.quarter > 1) {
            a.quarter -= 2;
        }  else {
            a.quarter = 3;
            a.year -= 1;
        }
    }
    return a;
};

exports.markObj = function(req1, req2, req3, callback) {
    var a = [];
    for (var i = 0; i < req1.length; i++) {
        var obj = {};
        var x = 0;
        obj.idMark   =  "";
        obj._id      =  req1[i]._id.toString();
        obj.name     =  req1[i].name.toString();
        obj.markDef  =  0;
        obj.markPrev =  0;
        x = 0;
        for(var j = 0; j < req2.length; j++) {
            if (req1[i]._id.toString() === req2[j].linkCri.toString()) {
                x++;
                obj.idMark    = req2[j]._id.toString();
                obj.markDef   += req2[j].valueMark;
            }
        }
        obj.markDef = (x === 0) ? 0 : (obj.markDef/x);
        x = 0;
        for(j = 0; j < req3.length; j++) {
            if (req1[i]._id.toString() === req3[j].linkCri.toString()) {
                x++;
                obj.markPrev  += req3[j].valueMark;
            }
        }
        obj.markPrev = (x === 0) ? 0 : (obj.markPrev/x);
        a[i] = obj;
    }
    callback(a);
};

Array.prototype.max = function(){
    return Math.max.apply( Math, this);
};


exports.chartRadar = function(markData) {

    var chartDataSets = [];
    var chartData = [];
    var chartLabel = [];
    var data = {};
    var maxMark = 7;
    for (var i = 0; i < 2; i++) {chartData[i] = [];}

    for (i = 0; i < markData.length; i++) {
        chartLabel[i] = i + 1;
        chartData[0][i] =  maxMark - markData[i].markPrev;
        chartData[1][i] =  maxMark - markData[i].markDef;
    }

    data.labels = chartLabel;
    if (!data.labels) {data.labels = [];}

    for(i = 0; i < 2; i++) {
        var chartDataSet = {};
        if (i === 1) {
            chartDataSet.fillColor = 'rgba(220,0,0,0.3)';
            chartDataSet.strokeColor = 'rgba(220,0,0,1)';
            chartDataSet.pointColor = 'rgba(220,0,0,1)';
            chartDataSet.pointStrokeColor = '#fff';
        }
        if (i === 0) {
            chartDataSet.fillColor = 'rgba(0,220,0,0.3)';
            chartDataSet.strokeColor = 'rgba(0,220,0,1)';
            chartDataSet.pointColor = 'rgba(0,220,0,1))';
            chartDataSet.pointStrokeColor = '#fff';
        }
        chartDataSet.data = chartData[i];
        chartDataSets.push(chartDataSet);
    }
    data.datasets = chartDataSets;
    return data;
};

