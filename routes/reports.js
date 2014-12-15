var async    = require('async');
var chart    = require('libs/chart-pdf');
var logs     = require('libs/logs')('CON');
var fs       = require('fs');
var Obj      = require('models/object').Obj;
var CriGrp   = require('models/crigroup').CriGroup;
var Mark     = require('models/mark').Mark;
var HleFunc  = require('libs/func-hle');

exports.report1 = function(err, res) {
    var config = {
        scaleSector : 4,
        scaleOverlay : false,
        scaleOverride : true,
        scaleSteps : 10,
        scaleStepWidth : 1,
        scaleStartValue : 0,
        scaleShowLine : true,
        scaleLineColor : "rgba(0,0,0,0.2)",
        scaleLineWidth : 1,
        scaleShowLabels : false,
        scaleFontFamily : "'Arial'",
        scaleFontSize : 10,
        scaleFontStyle : "normal",
        scaleFontColor : "#666",
        scaleShowLabelBackdrop : true,
        scaleBackdropColor : "black",
        scaleBackdropPaddingY : 2,
        scaleBackdropPaddingX : 2,
        angleShowLineOut : true,
        angleLineColor : "rgba(0,0,0,.2)",
        angleLineWidth : 1,
        pointLabelFontFamily : "'Arial'",
        pointLabelFontStyle : "normal",
        pointLabelFontSize : 12,
        pointLabelFontColor : "#000",
        pointDot : true,
        pointDotRadius : 3,
        pointDotStrokeWidth : 1,
        datasetStroke : true,
        datasetStrokeWidth : 2,
        datasetFill : true,
        sectorTargetRed : "red",
        sectorTargetYellow : "yellow",
        sectorTargetGreen :"green"
    };

    var chartDataSets = [];
    var chartData = [];
    var chartLabel = [];
    var data = {};
    var lenMax = 12;

    for (var i = 0; i < 2; i++) {chartData[i] = [];}

    for (i = 0; i < lenMax; i++) {
        chartLabel[i] = i + 1;
        chartData[0][i] =  config.scaleSteps - 3;
        chartData[1][i] =  config.scaleSteps - 4;
    }
    chartLabel[0] = 'кредиты';
    chartLabel[1] = 'депозиты';
    chartLabel[2] = 'вклады';
    chartLabel[3] = 'учеба';
    chartLabel[4] = 'парадокс';
    chartLabel[5] = 'туннель';
    chartLabel[6] = 'лизинг';
    chartLabel[7] = 'автоботы';
    chartLabel[8] = 'кошелек';
    chartLabel[9] = 'деньги';
    chartLabel[11] = 'поручит.';
    chartLabel[10] = 'залоги';
    data.labels = chartLabel;
    if (!data.labels) {data.labels = [];}

    for(i = 0; i < 2; i++) {
        var chartDataSet = {};
        if (i === 1) {
            chartDataSet.fillColor = 'rgba(220,220,220,0.3)';
            chartDataSet.strokeColor = 'rgba(220,220,220,1)';
            chartDataSet.pointColor = 'rgba(220,220,220,1)';
            chartDataSet.pointStrokeColor = '#fff';
        }
        if (i === 0) {
            chartDataSet.fillColor = 'rgba(151,187,205,0.3)';
            chartDataSet.strokeColor = 'rgba(151,187,205,1)';
            chartDataSet.pointColor = 'rgba(151,187,205,1))';
            chartDataSet.pointStrokeColor = '#fff';
        }
        chartDataSet.data = chartData[i];
        chartDataSets.push(chartDataSet);
    }

    data.datasets = chartDataSets;
    chart.polar(config, data, function (err, buf){
        fs.writeFile("./public/repo/report1.pdf", buf, function(err) {
            if(err) {
                logs.warn(err);
                res.status(403).json(err.message);
            } else {
                logs.info("Файл сохранен в report1.pdf.");
                res.status(200).json('success');
            }
        });
    });

};

exports.report2 = function(req, res) {

    var chartDataSets = [];
    var chartData = [];
    var chartLabel = [];
    var data = {};
    var i = 0;
    var j =0;
    for (i = 0; i < 4; i++) {chartData[i] = [];}
    var qy = [];
    var a = {};
    var radioObj = req.body.radioObj;
    var periodLeg = (radioObj == "true") ? "квартал" : "полугодие";

    a.quarter = parseInt(req.body.idQuarter);
    a.year = parseInt(req.body.idYear);
    a.periodLeg = periodLeg;
    a.periodNum = HleFunc.periodQY(radioObj, a.quarter);

    qy[0] = a;
    qy[1] = HleFunc.prevQY(radioObj, qy[0].quarter, qy[0].year); qy[1].periodLeg = periodLeg; qy[1].periodNum = HleFunc.periodQY(radioObj, qy[1].quarter);
    qy[2] = HleFunc.prevQY(radioObj, qy[1].quarter, qy[1].year); qy[2].periodLeg = periodLeg; qy[2].periodNum = HleFunc.periodQY(radioObj, qy[2].quarter);
    qy[3] = HleFunc.prevQY(radioObj, qy[2].quarter, qy[2].year); qy[3].periodLeg = periodLeg; qy[3].periodNum = HleFunc.periodQY(radioObj, qy[3].quarter);
    async.waterfall([
        function(callback) {
            Obj.allList(function(err, obj) {
                callback(null, obj);
            });
        },
        function(obj, callback) {
            Mark.avgMark(qy, radioObj, function(err, mark) {
                i = 0;
                obj.forEach(function(valObj){
                    chartLabel[i] = valObj.name;
                    for (j = 0; j < 4; j++) {
                        chartData[j][i] = 0;
                    }
                    mark.forEach(function(valMark){
                        if (valMark.obj.toString() === valObj._id.toString()) {
                            for (j = 0; j < 4; j++) {
                                if ((valMark.quarter === qy[j].quarter) && (valMark.year === qy[j].year)) {
                                    chartData[j][i] = valMark.mark/valMark.count;
                                }
                            }
                        }
                    });
                    i++;
                });
                callback(null, mark);
            });
        }
    ],
        function(){
            data.labels = chartLabel;
            if (!data.labels) {data.labels = [];}

            for(i = 0; i < 4; i++) {
                var chartDataSet = {};
                if (i === 1) {
                    chartDataSet.fillColor = 'red';
                    chartDataSet.strokeColor = 'red';
                }
                if (i === 0) {
                    chartDataSet.fillColor = 'green';
                    chartDataSet.strokeColor = 'green';
                }
                if (i === 2) {
                    chartDataSet.fillColor = 'blue';
                    chartDataSet.strokeColor = 'blue';
                }
                if (i === 3) {
                    chartDataSet.fillColor = 'gray';
                    chartDataSet.strokeColor = 'gray';
                }
                chartDataSet.data = chartData[i];
                chartDataSets.push(chartDataSet);
            }

            data.datasets = chartDataSets;
            data.legends = qy;
            chart.bar(data, function (err){
                if(err) {
                    logs.warn(err);
                    res.status(403).json(err.message);
                } else {
                    logs.info("Файл сохранен в report2.pdf.");
                    res.status(200).json('success');
                }
            });
        }
    );
};

exports.report3 = function(req, res) {

    var chartDataSets = [];
    var chartData = [];
    var chartLabel = [];
    var data = {};
    var i = 0;
    var j =0;
    for (i = 0; i < 4; i++) {chartData[i] = [];}
    var qy = [];
    var a = {};
    var radioObj = req.body.radioObj;
    var idObj    = req.body.idObj;
    var periodLeg = (radioObj == "true") ? "квартал" : "полугодие";

    a.quarter = parseInt(req.body.idQuarter);
    a.year = parseInt(req.body.idYear);
    a.periodLeg = periodLeg;
    a.periodNum = HleFunc.periodQY(radioObj, a.quarter);

    qy[0] = a;
    qy[1] = HleFunc.prevQY(radioObj, qy[0].quarter, qy[0].year); qy[1].periodLeg = periodLeg; qy[1].periodNum = HleFunc.periodQY(radioObj, qy[1].quarter);
    qy[2] = HleFunc.prevQY(radioObj, qy[1].quarter, qy[1].year); qy[2].periodLeg = periodLeg; qy[2].periodNum = HleFunc.periodQY(radioObj, qy[2].quarter);
    qy[3] = HleFunc.prevQY(radioObj, qy[2].quarter, qy[2].year); qy[3].periodLeg = periodLeg; qy[3].periodNum = HleFunc.periodQY(radioObj, qy[3].quarter);
    async.waterfall([
            function(callback) {
                CriGrp.allList(function(err, crigrp) {
                    callback(null, crigrp);
                });
            },
            function(crigrp, callback) {
                Mark.avgMarkObj(qy, idObj, radioObj, function(err, mark) {
                    i = 0;
                    crigrp.forEach(function(valGrp){
                        chartLabel[i] = valGrp.name;
                        for (j = 0; j < 4; j++) {
                            chartData[j][i] = 0;
                        }
                        mark.forEach(function(valMark){
                            if (valMark.group.toString() === valGrp._id.toString()) {
                                for (j = 0; j < 4; j++) {
                                    if ((valMark.quarter === qy[j].quarter) && (valMark.year === qy[j].year)) {
                                        chartData[j][i] = valMark.mark/valMark.count;
                                    }
                                }
                            }
                        });
                        i++;
                    });
                    callback(null, mark);
                });
            }
        ],
        function(){
            data.labels = chartLabel;
            if (!data.labels) {data.labels = [];}

            for(i = 0; i < 4; i++) {
                var chartDataSet = {};
                if (i === 1) {
                    chartDataSet.fillColor = 'red';
                    chartDataSet.strokeColor = 'red';
                }
                if (i === 0) {
                    chartDataSet.fillColor = 'green';
                    chartDataSet.strokeColor = 'green';
                }
                if (i === 2) {
                    chartDataSet.fillColor = 'blue';
                    chartDataSet.strokeColor = 'blue';
                }
                if (i === 3) {
                    chartDataSet.fillColor = 'gray';
                    chartDataSet.strokeColor = 'gray';
                }
                chartDataSet.data = chartData[i];
                chartDataSets.push(chartDataSet);
            }

            data.datasets = chartDataSets;
            data.legends = qy;
            chart.bar(data, function (err){
                if(err) {
                    logs.warn(err);
                    res.status(403).json(err.message);
                } else {
                    logs.info("Файл сохранен в report2.pdf.");
                    res.status(200).json('success');
                }
            });
        }
    );
};

exports.download = function(req, res) {
    var file = "./public/repo/report2.pdf";
    res.status(200).download(file);
};

exports.loaddy = function(req, res) {
    res.status(200).send('47422ecc835fa505cf200a490a759994d9d811a8ee63d1dc09f2e0f8');
}



