var canvas = require('canvas');
var width = 390;
var height = 390;
canvas = new canvas(width, height);
var ctx = canvas.getContext('2d');
var font = canvas.font;
var fs = require('fs');

exports.Radar = function (markData, callback) {
    var config = {
        scaleSector : 4,
        scaleOverlay : false,
        scaleOverride : true,
        scaleSteps : 7,
        scaleStepWidth : 1,
        scaleStartValue : 0,
        scaleShowLine : true,
        scaleLineColor : "rgba(0,0,0,0.2)",
        scaleLineWidth : 1,
        scaleShowLabels : false,
        scaleFontFamily : "'Arial'",
        scaleFontSize : 12,
        scaleFontStyle : "normal",
        scaleFontColor : "#666",
        scaleShowLabelBackdrop : true,
        scaleBackdropColor : "rgba(255,255,255,0.95)",
        scaleBackdropPaddingY : 2,
        scaleBackdropPaddingX : 2,
        angleShowLineOut : true,
        angleLineColor : "rgba(0,0,0,.2)",
        angleLineWidth : 1,
        pointLabelFontFamily : "'Arial'",
        pointLabelFontStyle : "normal",
        pointLabelFontSize : 12,
        pointLabelFontColor : "#666",
        pointDot : true,
        pointDotRadius : 3,
        pointDotStrokeWidth : 1,
        datasetStroke : true,
        datasetStrokeWidth : 2,
        datasetFill : true,
        sectorTargetRed : 'rgba( 220, 100, 100, 0.5)',
        sectorTargetYellow :'rgba( 220, 220, 100, 0.5)',
        sectorTargetGreen :'rgba( 100, 220, 100, 0.5)'
    };

    //var maxSize, scaleHop, scaleGraph, labelHeight, scaleHeight, labelTemplateString;
    var chartDataSets = [];
    var chartData = [];
    var chartLabel = [];
    var data = {};

    for (var i = 0; i < 2; i++) {chartData[i] = [];}

    for (i = 0; i < markData.length; i++) {
        chartLabel[i] = i + 1;
        chartData[0][i] =  config.scaleSteps - markData[i].markPrev;
        chartData[1][i] =  config.scaleSteps - markData[i].markDef;
    }
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

    var maxSize = (Min([width,height])/2);
    var labelHeight = config.scaleFontSize*2;
    var labelLength = 0;

    for (i=0; i<data.labels.length; i++){
        ctx.font = config.pointLabelFontStyle + " " + config.pointLabelFontSize+"px " + config.pointLabelFontFamily;
        var textMeasurement = ctx.measureText(data.labels[i]).width;
        labelLength = (textMeasurement > labelLength) ? textMeasurement : labelLength;
    }

    //Figure out whats the largest - the height of the text or the width of what's there, and minus it from the maximum usable size.
    maxSize -= Max([labelLength,((config.pointLabelFontSize/2)*1.5)]);

    maxSize -= config.pointLabelFontSize;
    maxSize = CapValue(maxSize, null, 0);
    var scaleHeight = maxSize;
    //If the label height is less than 5, set it to 5 so we don't have lines on top of each other.
    labelHeight = Default(labelHeight,5);


    var valueBounds = {};
    var upperValue = Number.MIN_VALUE;
    var lowerValue = Number.MAX_VALUE;

    for (i=0; i<data.datasets.length; i++){
        for (j=0; j<data.datasets[i].data.length; j++){
            if (data.datasets[i].data[j] > upperValue){upperValue = data.datasets[i].data[j]}
            if (data.datasets[i].data[j] < lowerValue){lowerValue = data.datasets[i].data[j]}
        }
    }

    var maxSteps = Math.floor((scaleHeight / (labelHeight*0.66)));
    var minSteps = Math.floor((scaleHeight / labelHeight*0.5));

    valueBounds.maxValue = upperValue;
    valueBounds.minValue = lowerValue;
    valueBounds.maxSteps = maxSteps;
    valueBounds.minSteps = minSteps;

    var labelTemplateString = (config.scaleShowLabels) ? config.scaleLabel : null;

    //Check and set the scale
    if (!config.scaleOverride){
        var calculatedScale = calculateScale(valueBounds.maxSteps,valueBounds.minSteps,valueBounds.maxValue,valueBounds.minValue,labelTemplateString);
    }
    else {
        calculatedScale = {
            steps : config.scaleSteps,
            stepValue : config.scaleStepWidth,
            graphMin : config.scaleStartValue,
            labels : []
        };
        populateLabels(labelTemplateString, calculatedScale.labels, calculatedScale.steps, config.scaleStartValue, config.scaleStepWidth);
    }

    var scaleHop = maxSize/(calculatedScale.steps);
    var scaleGraph = maxSize/(config.scaleSector);

    //Begin Рисует круги и секторы
    ctx.save();

    rotationDegree = (2*Math.PI)/data.datasets[0].data.length;
    ctx.translate(200, 200);
    //ctx.translate(width/2, height/2);

    ctx.lineWidth = config.scaleLineWidth;

    ctx.beginPath();
    ctx.arc(0,0, (scaleGraph), 0, 2*Math.PI, false);
    ctx.closePath();
    ctx.fillStyle = config.sectorTargetGreen;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0,0, (scaleGraph*2), 0, 2*Math.PI, false);
    ctx.arc(0,0, (scaleGraph), 0, -2*Math.PI, true);
    ctx.closePath();
    ctx.fillStyle = config.sectorTargetYellow;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0,0, (scaleGraph*3), 0, 2*Math.PI, false);
    ctx.arc(0,0, (scaleGraph*2), 0, -2*Math.PI, true);
    ctx.closePath();
    ctx.fillStyle = config.sectorTargetYellow;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0,0, (scaleGraph*4), 0, 2*Math.PI, false);
    ctx.arc(0,0, (scaleGraph*3), 0, -2*Math.PI, true);
    ctx.closePath();
    ctx.fillStyle = config.sectorTargetRed;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0,0, (scaleGraph*4), 0, 2*Math.PI, false);
    ctx.closePath();
    ctx.strokeStyle =config.scaleLineColor;
    ctx.lineWidth = config.scaleLineWidth;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0,0, (scaleGraph*3), 0, 2*Math.PI, false);
    ctx.closePath();
    ctx.strokeStyle =config.scaleLineColor;
    ctx.lineWidth = config.scaleLineWidth;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0,0, (scaleGraph*2), 0, 2*Math.PI, false);
    ctx.closePath();
    ctx.strokeStyle =config.scaleLineColor;
    ctx.lineWidth = config.scaleLineWidth;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0,0, scaleGraph, 0, 2*Math.PI, false);
    ctx.closePath();
    ctx.strokeStyle =config.scaleLineColor;
    ctx.lineWidth = config.scaleLineWidth;
    ctx.stroke();
    //ctx.save();

    if (config.angleShowLineOut){
        ctx.strokeStyle = config.angleLineColor;
        ctx.lineWidth = config.angleLineWidth;
        for (var h=0; h<data.datasets[0].data.length; h++){

            ctx.rotate(rotationDegree);
            ctx.beginPath();
            ctx.moveTo(0,0);
            ctx.lineTo(0,-maxSize);
            ctx.closePath();
            ctx.stroke();
        }
    }

    ctx.strokeStyle = config.scaleLineColor;
    ctx.lineWidth = config.scaleLineWidth;

    for (i=0; i<calculatedScale.steps; i++){
        if (config.scaleShowLabels){
            ctx.textAlign = 'center';
            ctx.font = config.scaleFontStyle + " " + config.scaleFontSize+"px " + config.scaleFontFamily;
            ctx.textBaseline = "middle";
            if (config.scaleShowLabelBackdrop){
                var textWidth = ctx.measureText(calculatedScale.labels[i]).width;
                ctx.fillStyle = config.scaleBackdropColor;
                ctx.beginPath();
                ctx.rect(
                    Math.round(- textWidth/2 - config.scaleBackdropPaddingX),     //X
                    Math.round((-scaleHop * (i + 1)) - config.scaleFontSize*0.5 - config.scaleBackdropPaddingY),//Y
                    Math.round(textWidth + (config.scaleBackdropPaddingX*2)), //Width
                    Math.round(config.scaleFontSize + (config.scaleBackdropPaddingY*2)) //Height
                );
                ctx.fill();
            }
            ctx.fillStyle = config.scaleFontColor;
            ctx.fillText(calculatedScale.labels[i],0,-scaleHop*(i+1));
        }

    }

    for (k=0; k < data.labels.length; k++){
        ctx.font = config.pointLabelFontStyle + " " + config.pointLabelFontSize+"px " + config.pointLabelFontFamily;
        ctx.fillStyle = config.pointLabelFontColor;
        var opposite = Math.sin(rotationDegree*k) * (maxSize + config.pointLabelFontSize);
        var adjacent = Math.cos(rotationDegree*k) * (maxSize + config.pointLabelFontSize);

        if(rotationDegree*k == Math.PI || rotationDegree*k == 0){
            ctx.textAlign = "center";
        }
        else if(rotationDegree*k > Math.PI){
            ctx.textAlign = "right";
        }
        else{
            ctx.textAlign = "left";
        }

        ctx.textBaseline = "middle";

        ctx.fillText(data.labels[k],opposite,-adjacent);

    }
    //ctx.restore();
    //Stop Рисует круги и секторы

    //Begin Radar specific functions.
    var countData = 1;
    if (!data.datasets[0].data.length) {
        countData = 1;
    } else {
        countData = data.datasets[0].data.length;
    }
    var rotationDegree = (2 * Math.PI)/countData;

    //ctx.save();
    //translate to the centre of the canvas.
    //ctx.translate(width/2, height/2);

    //We accept multiple data sets for radar charts, so show loop through each set
    for (i = 0; i < data.datasets.length; i++){
        ctx.beginPath();
        ctx.moveTo(0, -1 * calculateOffset(data.datasets[i].data[0], calculatedScale, scaleHop));
        for (var j=1; j<data.datasets[i].data.length; j++){
            ctx.rotate(rotationDegree);
            ctx.lineTo(0, -1 * calculateOffset(data.datasets[i].data[j], calculatedScale, scaleHop));
        }
        ctx.closePath();

        ctx.fillStyle = data.datasets[i].fillColor;
        ctx.fill();
        ctx.strokeStyle = data.datasets[i].strokeColor;
        ctx.lineWidth = config.datasetStrokeWidth;
        ctx.stroke();

        if (config.pointDot){
            for (var k=0; k<data.datasets[i].data.length; k++){
                ctx.rotate(rotationDegree);
                ctx.beginPath();
                ctx.arc(0, -1 * calculateOffset(data.datasets[i].data[k], calculatedScale, scaleHop), config.pointDotRadius,0,2*Math.PI,false);
                ctx.closePath();
                ctx.fillStyle = data.datasets[i].pointColor;
                ctx.fill();
                ctx.strokeStyle = data.datasets[i].pointStrokeColor;
                ctx.lineWidth = config.pointDotStrokeWidth;
                ctx.stroke();
            }
        }
        ctx.rotate(rotationDegree);
    }
    ctx.restore();
    canvas.toDataURL('image/png', function(err, buf){
        var data = buf.replace(/^data:image\/\w+;base64,/, '');
        var img = new Buffer(data, 'base64');
        fs.writeFile('./public/img/chart1.png', img);
        callback(null, buf);
        ctx.clearRect(0, 0, width, height)
    });
    //Stop Radar specific functions.
};

//Populate an array of all the labels by interpolating the string.
function populateLabels(labelTemplateString, labels, numberOfSteps, graphMin, stepValue) {
    if (labelTemplateString) {
        //Fix floating point errors by setting to fixed the on the same decimal as the stepValue.
        for (var i = 1; i < numberOfSteps + 1; i++) {
            labels.push(labelTemplateString, {value: (graphMin + (stepValue * i)).toFixed(getDecimalPlaces(stepValue))});
        }
    }
}

//Max value from array
function Max( array ){
    return Math.max.apply( Math, array );
}

//Min value from array
function Min( array ){
    return Math.min.apply( Math, array );
}

//Default if undefined
function Default(userDeclared,valueIfFalse){
    if(!userDeclared){
        return valueIfFalse;
    } else {
        return userDeclared;
    }
}
//Is a number function

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

//Apply cap a value at a high or low number
function CapValue(valueToCap, maxValue, minValue){
    if(isNumber(maxValue)) {
        if( valueToCap > maxValue ) {
            return maxValue;
        }
    }
    if(isNumber(minValue)){
        if ( valueToCap < minValue ){
            return minValue;
        }
    }
    return valueToCap;
}

function getDecimalPlaces (num){
    if (num%1!=0){
        return num.toString().split(".")[1].length
    }
    else{
        return 0;
    }

}

function calculateScale(maxSteps, minSteps, maxValue, minValue, labelTemplateString){

    var valueRange = maxValue - minValue;
    var rangeOrderOfMagnitude = calculateOrderOfMagnitude(valueRange);
    var graphMin = Math.floor(minValue / (Math.pow(10, rangeOrderOfMagnitude))) * Math.pow(10, rangeOrderOfMagnitude);
    var graphMax = Math.ceil(maxValue / (Math.pow(10, rangeOrderOfMagnitude))) * Math.pow(10, rangeOrderOfMagnitude);
    var graphRange = graphMax - graphMin;
    var stepValue = Math.pow(10, rangeOrderOfMagnitude);
    var numberOfSteps = Math.round(graphRange / stepValue);

    //Compare number of steps to the max and min for that size graph, and add in half steps if need be.
    while(numberOfSteps < minSteps || numberOfSteps > maxSteps) {
        if (numberOfSteps < minSteps){
            stepValue /= 2;
            numberOfSteps = Math.round(graphRange/stepValue);
        }
        else{
            stepValue *=2;
            numberOfSteps = Math.round(graphRange/stepValue);
        }
    }

    var labels = [];
    populateLabels(labelTemplateString, labels, numberOfSteps, graphMin, stepValue);

    return {
        steps : numberOfSteps,
        stepValue : stepValue,
        graphMin : graphMin,
        labels : labels
    };

    function calculateOrderOfMagnitude(val){
        return Math.floor(Math.log(val) / Math.LN10);
    }
}

function calculateOffset(val,calculatedScale,scaleHop){
    var outerValue = calculatedScale.steps * calculatedScale.stepValue;
    var adjustedValue = val - calculatedScale.graphMin;
    var scalingFactor = CapValue(adjustedValue/outerValue,1,0);
    return (scaleHop*calculatedScale.steps) * scalingFactor;
}

exports.ClearGraph = function(){
    return ctx.clearRect(0, 0, width, height);
};

exports.DataUrl = function() {
    return canvas.toDataURL();
};




