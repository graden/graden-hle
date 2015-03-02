var pdfDoc  = require('pdfkit');
var fs = require('fs');

exports.polar = function(config, data, callback) {
    var docOptions = {
        size: "A4",
        layout: "portrait",
        info: {
            Title: "Оценка объектов",
            Author: "Denis Grankin"
        }
    };
    var doc = new pdfDoc(docOptions);
    var width = 400;
    var height = 400;


    //var maxSize, scaleHop, scaleGraph, labelHeight, scaleHeight, labelTemplateString;
    
    var maxSize = (Min([width,height])/2);
    var labelHeight = config.scaleFontSize*2;
    var labelLength = 0;



    //doc.font('fonts/FreeMono.ttf');
    //doc.font(config.scaleFont);
    doc.fontSize(config.pointLabelFontSize);

    var textMeasurement = 0;
    for (i=0; i < data.labels.length; i++){
        textMeasurement = doc.widthOfString(data.labels[i].toString());
        if(textMeasurement > labelLength) {labelLength = textMeasurement};
    }

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
        for (var j=0; j<data.datasets[i].data.length; j++){
            if (data.datasets[i].data[j] > upperValue){upperValue = data.datasets[i].data[j]}
            if (data.datasets[i].data[j] < lowerValue){lowerValue = data.datasets[i].data[j]}
        }
    }

    var maxSteps = Math.floor((scaleHeight / (labelHeight*0.66)));
    var minSteps = Math.floor((scaleHeight / (labelHeight*0.5)));

    valueBounds.maxValue = upperValue;
    valueBounds.minValue = lowerValue;
    valueBounds.maxSteps = maxSteps;
    valueBounds.minSteps = minSteps;

    var labelTemplateString = (config.scaleShowLabels)? config.scaleLabel : null;

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

    doc.save();
    doc.fontSize(24);
    doc.text('Мишень', 50, 10, {align: 'center'});{origin: [0,0]}

    doc.translate(300, 300);

    doc.strokeOpacity(0.7);
    doc.lineWidth(scaleGraph);

    doc.circle(0,0, (scaleGraph/2));
    doc.stroke("green");

    doc.circle(0,0, (scaleGraph/2*3));
    doc.stroke("yellow");

    doc.circle(0,0, (scaleGraph/2*5));
    doc.stroke("yellow");

    doc.circle(0,0, (scaleGraph/2*7));
    doc.stroke("red");

    doc.lineWidth(1);
    doc.strokeOpacity(0.5);


    doc.circle(0,0, (scaleGraph));
    doc.stroke("black");
    doc.circle(0,0, (scaleGraph*2));
    doc.stroke("black");
    doc.circle(0,0, (scaleGraph*3));
    doc.stroke("black");
    doc.circle(0,0, (scaleGraph*4));
    doc.stroke("black");

    if (config.angleShowLineOut){
        doc.strokeOpacity(0.5);
        doc.lineWidth(1);
        var rotationDegree = (2*Math.PI)/data.datasets[0].data.length;
        var rD = 360/data.datasets[0].data.length;
        for (var h = 0; h < data.datasets[0].data.length; h++){
            doc.rotate(rD, {origin: [0,0]});
            doc.moveTo(0,0);
            doc.lineTo(0,-maxSize);
            doc.stroke("black");
        }
    }
    doc.font('fonts/FreeMono.ttf');
    doc.fontSize(config.pointLabelFontSize);
    doc.fillColor(config.pointLabelFontColor);

    for (var k=0; k < data.labels.length; k++){
        var opposite = Math.sin(rotationDegree*k) * (maxSize + doc.currentLineHeight());
        var adjacent = Math.cos(rotationDegree*k) * (maxSize + doc.currentLineHeight()) + 5;
        var txtWidth = doc.widthOfString(data.labels[k].toString());
        if(rotationDegree*k == Math.PI || rotationDegree*k == 0){
            doc.text(data.labels[k], opposite - (txtWidth/2), -adjacent, {align: 'left', width: txtWidth});
        }
        else if(rotationDegree*k > Math.PI){
            doc.text(data.labels[k], opposite - txtWidth, -adjacent, {align: 'left'});
        }
        else {
            doc.text(data.labels[k], opposite, -adjacent, {align: 'left'});
        }
    }

    doc.addPage();
    doc.font('fonts/FreeMono.ttf');
    doc.fontSize(24);
    doc.text('Страна Кипр',50, 100, {align: 'center'});
    doc.fontSize(14);
    var txt = 'Большая часть острова занята горами. Вдоль северного берега в широтном направлении тянется горная цепь Кирения. ' +
        'Ширина её в западной части 15 км, к востоку она расширяется до 30 км. Западная часть хребта Кирения более высокая ' +
        'отдельные вершины превышают 1 тысячу метров. Самая высокая точка хребта это гора Акроманда 1023 м. Юго-западная половина острова занята ' +
        'широким горным массивом Троодос, изрезанным продольными речными долинами. ' +
        'Наиболее высока его северная часть, здесь находится и самая высокая точка Кипра это гора Олимп 1952 метров.'
    doc.text(txt, {width: 480, align: 'right'});
    doc.moveDown;
    doc.rect(49, 99, 481, doc.y - 99)
    doc.stroke();

    doc.y = doc.y + 10;
    doc.x = 50;

    var startY = doc.y;
    var startX = doc.x;

    doc.text('Страны', startX, startY, {width: 80, align: 'center'});
    doc.text('Япония', startX+80, startY, {width: 80, align: 'center'});
    doc.text('Россия', startX+160, startY, {width: 80, align: 'center'});
    doc.text('Украина', startX+240, startY, {width: 80, align: 'center'});
    doc.moveDown(0.2);

    doc.rect(startX, startY, 80, doc.y - startY);
    doc.rect(startX+80, startY, 80, doc.y - startY);
    doc.rect(startX+160, startY, 80, doc.y - startY);
    doc.rect(startX+240, startY, 80, doc.y - startY);

    startY = doc.y;
    doc.text('Регионы', startX, startY, {width: 80, align: 'center'});
    doc.text('Якогама', startX+80, startY, {width: 80, align: 'center'});
    doc.text('Омск', startX+160, startY, {width: 80, align: 'center'});
    doc.text('Киев', startX+240, startY, {width: 80, align: 'center'});
    doc.moveDown(0.2);

    doc.rect(startX, startY, 80, doc.y - startY);
    doc.rect(startX+80, startY, 80, doc.y - startY);
    doc.rect(startX+160, startY, 80, doc.y - startY);
    doc.rect(startX+240, startY, 80, doc.y - startY);
    doc.stroke('#000');
    doc.pipe(fs.createWriteStream('./test.pdf'));
    //console.log(config.scaleFontColor);
    doc.text('Generate PDF!');
    doc.end();

    stream.on('finish', function() {
        //console.log('to pdf');
        var buf = stream.toBlob('application/pdf');
        callback(null, buf);
        //iframe.src = stream.toBlobURL('application/pdf');
    });
    //doc.output(function(buf){
    //
    //});
};

exports.kitRepo2 = function(pathPDF, data, callback){
    var docOptions = {
        size: "A4",
        layout: "portrait",
        info: {
            Title: "Оценка объектов",
            Author: "Denis Grankin"
        }
    };

    var docs = new pdfDoc(docOptions);

    var config = {
        width : 450,
        height : 300,
        xPos : 0,
        yPos : 90,
        scaleOverlay : true,
        scaleOverride : false,
        scaleSteps : 5,
        scaleStepWidth : 1,
        scaleStartValue : 0,
        scaleLineColor : "gray",
        scaleLineWidth : 1,
        scaleShowLabels : true,
        scaleLabel : "Легенда",
        scaleFont : "fonts/FreeMono.ttf",
        scaleFontSize : 9,
        scaleFontColor : "black",
        scaleShowGridLines : true,
        scaleGridLineColor : "gray",
        scaleGridLineWidth : 0.1,
        barShowStroke : false,
        barStrokeWidth : 0,
        barValueSpacing : 2,
        barDatasetSpacing : 1,
        ManualFirstLabel : 0
    };

    docs.font(config.scaleFont);
    docs.fontSize(20);
    docs.text('Оценка работы по POS',config.xPos, 20, {align: 'center', width: config.width});
    docs.moveDown(0.2);

    barDiag(docs, config, data);

    docs.end();
    var ws = fs.createWriteStream(pathPDF);
    ws.on('open', function(){
        docs.pipe(ws);
    });

    ws.on('finish', function(){
        callback(null, pathPDF);
    });

};

exports.kitRepo3 = function(pathPDF, data, callback){
    var docOptions = {
        size: "A4",
        layout: "portrait",
        info: {
            Title: "Оценка объекта",
            Author: "Denis Grankin"
        }
    };

    var docs = new pdfDoc(docOptions);

    var config1 = {
        width : 450,
        height : 200,
        xPos : 0,
        yPos : 90,
        scaleOverlay : true,
        scaleOverride : false,
        scaleSteps : 5,
        scaleStepWidth : 1,
        scaleStartValue : 0,
        scaleLineColor : "gray",
        scaleLineWidth : 1,
        scaleShowLabels : true,
        scaleLabel : "Легенда",
        scaleFont : "fonts/FreeMono.ttf",
        scaleFontSize : 9,
        scaleFontColor : "black",
        scaleShowGridLines : true,
        scaleGridLineColor : "gray",
        scaleGridLineWidth : 0.1,
        barShowStroke : false,
        barStrokeWidth : 0,
        barValueSpacing : 5,
        barDatasetSpacing : 3,
        ManualFirstLabel : 110
    };

    docs.font(config1.scaleFont);
    docs.fontSize(14);

    docs.text('Оценка работы ' + data[2] + ' / ' + data[3], config1.xPos, 20, {align: 'center', width: 590});
    docs.moveDown(0.2);

    barDiag(docs, config1, data[0]);

    var config2 = {
        width : 450,
        height : 300,
        xPos : 0,
        yPos : 400,
        scaleOverlay : true,
        scaleOverride : false,
        scaleSteps : 5,
        scaleStepWidth : 1,
        scaleStartValue : 0,
        scaleLineColor : "gray",
        scaleLineWidth : 1,
        scaleShowLabels : true,
        scaleLabel : "Легенда",
        scaleFont : "fonts/FreeMono.ttf",
        scaleFontSize : 9,
        scaleFontColor : "black",
        scaleShowGridLines : true,
        scaleGridLineColor : "gray",
        scaleGridLineWidth : 0.1,
        barShowStroke : false,
        barStrokeWidth : 0,
        barValueSpacing : 2,
        barDatasetSpacing : 1,
        ManualFirstLabel : 0
    };

    barDiag(docs, config2, data[1]);

    //Show Tasks
    docs.addPage();
    docs.fillColor('black');
    docs.fontSize(14);

    docs.text('Поставленные задачи по ' + data[2] + ' / ' + data[3], config1.xPos, 20, {align: 'center', width: 590});
    docs.moveDown(1);
    var i = 0;
    var y = 0;
    var v = 0;
    docs.fontSize(10);
    data[4].forEach(function(val) {
        y = docs.y;
        i++;
        v = parseFloat(val.percentTask);
        if (isNaN(v)) {
            v = 0;
        }

        docs.text(i + ')', 30, y, {columns: 1, align:'left', width: 40});
        docs.text(v.toFixed(2) + ' %', 385, y, {columns: 1, align:'left', width: 120});
        docs.text(val.valueTask, 70, y, {columns: 1, align:'left', width: 300});
        docs.moveDown();
    });

    docs.end();
    var ws = fs.createWriteStream(pathPDF);
    ws.on('open', function(){
        docs.pipe(ws);
    });

    ws.on('finish', function(){
        callback(null, pathPDF);
    });

};

function barDiag(doc, config, data) {
    var maxSize = config.height;
    var i = 0;
    var j = 0;
    doc.font(config.scaleFont);
    doc.fontSize(config.scaleFontSize);
    //Need to check the X axis first - measure the length of each text metric, and figure out if we need to rotate by 45 degrees.
    var widestXLabel = 0;
    var rotateLabels = 0;
    var rotateLabelsDegree = 0;
    for (i=0; i<data.labels.length; i++){
        var textLength = doc.widthOfString(data.labels[i].toString());
        //If the text length is longer - make that equal to longest text!
        widestXLabel = (textLength > widestXLabel) ? textLength : widestXLabel;
    }
    if (config.width/data.labels.length < widestXLabel){
        rotateLabels = 45;
        rotateLabelsDegree = Math.PI/4;
        maxSize -= Math.cos(rotateLabelsDegree) * widestXLabel;
        /*
         if (config.width/data.labels.length < Math.cos(rotateLabels) * widestXLabel){
         rotateLabels = 90;
         rotateLabelsDegree = Math.PI/2;
         maxSize -= widestXLabel;
         }
         else{
         maxSize -= Math.sin(rotateLabels) * widestXLabel;
         }
         */
    }
    else{
        maxSize -= config.scaleFontSize;
    }
    //Add a little padding between the x line and the text
    maxSize -= 5;
    var labelHeight = config.scaleFontSize;
    //maxSize -= labelHeight;
    //Set 5 pixels greater than the font size to allow for a little padding from the X axis.
    var scaleHeight = maxSize;
    //Then get the area above we can safely draw on.

    var valueBounds = getValueBounds();

    function getValueBounds() {
        var upperValue = Number.MIN_VALUE;
        var lowerValue = Number.MAX_VALUE;
        for (i=0; i<data.datasets.length; i++){
            for (j=0; j<data.datasets[i].data.length; j++){
                if ( data.datasets[i].data[j] > upperValue) { upperValue = data.datasets[i].data[j] }
                if ( data.datasets[i].data[j] < lowerValue) { lowerValue = data.datasets[i].data[j] }
            }
        }

        var maxSteps = Math.floor((scaleHeight / (labelHeight*0.66)));
        var minSteps = Math.floor((scaleHeight / labelHeight*0.5));

        return {
            maxValue : upperValue,
            minValue : lowerValue,
            maxSteps : maxSteps,
            minSteps : minSteps
        };
    }

     //Check and set the scale
    var labelTemplateString = (config.scaleShowLabels) ? config.scaleLabel : "";
    var calculatedScale;
    if (!config.scaleOverride){
        calculatedScale = calculateScale(valueBounds.maxSteps,valueBounds.minSteps,valueBounds.maxValue,valueBounds.minValue,labelTemplateString);
    }
    else {
        calculatedScale = {
            steps : config.scaleSteps,
            stepValue : config.scaleStepWidth,
            graphMin : config.scaleStartValue,
            labels : []
        };
        populateLabels(labelTemplateString, calculatedScale.labels,calculatedScale.steps,config.scaleStartValue,config.scaleStepWidth);
    }
    var scaleHop = Math.floor(scaleHeight/calculatedScale.steps);

    //begin function calculateXAxisSize
    var longestText = 0;
    //if we are showing the labels
    if (config.scaleShowLabels){
        for (i=0; i<calculatedScale.labels.length; i++){
            var measuredText = doc.widthOfString(calculatedScale.labels[i].toString());
            longestText = (measuredText > longestText)? measuredText : longestText;
        }
        //Add a little extra padding from the y axis
        longestText +=10;
    }

    var wFirstLabel= Math.sin(rotateLabelsDegree)*doc.widthOfString(data.labels[0].toString());
    if (config.ManualFirstLabel > 0){
        wFirstLabel= config.ManualFirstLabel;
    }
    //var hBottonLabel= Math.cos(rotateLabelsDegree)*widestXLabel;

    var xAxisLength = config.width - ((wFirstLabel > longestText) ? wFirstLabel : longestText);

    var valueHop = Math.floor(xAxisLength/(data.labels.length));

    var barWidth = (valueHop - config.scaleGridLineWidth*2 - (config.barValueSpacing*2)
                 - (config.barDatasetSpacing*data.datasets.length-1)
                 - ((config.barStrokeWidth/2)*data.datasets.length-1))/data.datasets.length;

    var yAxisPosX = config.xPos + (config.width - xAxisLength);
    var xAxisPosY = config.yPos + (scaleHeight + config.scaleFontSize/2);

    //console.log('x= %d y= %d xLen= %d firstLabel= %d barWidth= %d maxSize= %d', yAxisPosX,xAxisPosY,xAxisLength,wFirstLabel,barWidth, maxSize);
    //end function calculateXAxisSize

    doc.lineWidth(config.barStrokeWidth);
    //begin drawing bars

    var barOffset =0;
    var lenBar = 0;
    for (i=0; i<data.datasets.length; i++){
        for (j=0; j<data.datasets[i].data.length; j++){
            barOffset = yAxisPosX + config.barValueSpacing + valueHop*j + barWidth*i
                       + config.barDatasetSpacing*i + config.barStrokeWidth*i;
            lenBar = calculateOffset(data.datasets[i].data[j],calculatedScale,scaleHop)+(config.barStrokeWidth/2);
            //console.log('lenBar='+lenBar+', data='+ data.datasets[i].data[j] );
            doc.rect(barOffset, xAxisPosY, barWidth, -lenBar);
            if(config.barShowStroke){
                doc.stroke(data.datasets[i].strokeColor);
            }
            doc.fill(data.datasets[i].fillColor);
        }
    }
    //end drawing bars


    //X axis line
    doc.save();
    doc.lineWidth(config.scaleLineWidth);
    doc.moveTo(yAxisPosX-5,xAxisPosY);
    doc.lineTo(yAxisPosX+xAxisLength+5,xAxisPosY);
    doc.strokeOpacity(0.2);
    doc.stroke(config.scaleLineColor);
    //if (rotateLabels > 0){
    //    doc.textAlign = "right";
    //}
    //else{
    //    doc.textAlign = "center";
    //}

    doc.fillColor(config.scaleFontColor);
    doc.fillOpacity(1);
    doc.strokeOpacity(1);
    for (i=0; i<data.labels.length; i++){
        if (rotateLabels > 0){
            doc.save();
            var wLabel45 = doc.widthOfString(data.labels[i].toString()+config.scaleFontSize);
            var zx = yAxisPosX + i*valueHop + valueHop/2 - Math.sin(rotateLabelsDegree)*wLabel45;
            var zy = xAxisPosY + Math.cos(rotateLabelsDegree)*wLabel45;
            doc.translate(zx, zy);
            doc.rotate(-(rotateLabels),{origin: [0,0]});
            doc.text(data.labels[i], 0, 0, {align: 'left', width: wLabel45});
            doc.restore();
        }
        else {
            var wLabel180 = doc.widthOfString(data.labels[i].toString());
            doc.text(data.labels[i], yAxisPosX + i*valueHop + valueHop/2 - wLabel180/2,xAxisPosY + config.scaleFontSize+3, {align: 'center', width: wLabel180});
        }
        doc.moveTo(yAxisPosX + (i+1) * valueHop, xAxisPosY+3);
        //Check i isnt 0, so we dont go over the Y axis twice.
        doc.lineWidth(config.scaleGridLineWidth);
        doc.lineTo(yAxisPosX + (i+1) * valueHop, config.yPos+5);
        doc.strokeOpacity(0.2);
        doc.stroke(config.scaleGridLineColor);
    }

    //Y axis
    doc.lineWidth(config.scaleLineWidth);
    doc.strokeColor(config.scaleLineColor);
    doc.strokeOpacity(0.2);
    doc.moveTo(yAxisPosX,xAxisPosY+5);
    doc.lineTo(yAxisPosX,config.yPos+5);
    doc.stroke();


    doc.lineWidth(config.scaleGridLineWidth);
    doc.strokeColor(config.scaleGridLineColor);

    for (j=0; j<calculatedScale.steps; j++){
        doc.moveTo(yAxisPosX-3,xAxisPosY - ((j+1) * scaleHop));
        if (config.scaleShowGridLines){
            doc.lineTo(yAxisPosX + xAxisLength, xAxisPosY - ((j+1) * scaleHop));
        }
        else {
            doc.lineTo(yAxisPosX-0.5,xAxisPosY - ((j+1) * scaleHop));
        }
        doc.stroke();
        if (config.scaleShowLabels){
            doc.fillColor(config.scaleFontColor);
            doc.fillOpacity(1);
            doc.text(calculatedScale.labels[j],yAxisPosX - longestText-5, xAxisPosY - ((j+1) * scaleHop) - config.scaleFontSize/2, {align: 'right', width: longestText});
        }
    }

    //Show legend
    doc.fontSize(config.scaleFontSize);
    doc.fill(config.scaleFontColor);
    doc.fillOpacity(1);
    doc.strokeOpacity(1);
    doc.text(config.scaleLabel, config.xPos+config.width+10, config.yPos);
    doc.fontSize(config.scaleFontSize);
    for (j=0; j<data.datasets.length; j++){
        doc.moveDown(0.3);
        doc.fill(config.scaleFontColor);
        doc.text('  ' + data.legends[j].periodNum  + data.legends[j].periodLeg  + ' ' + data.legends[j].year + ' (' + data.legMiddle[j].toFixed(2) + ')'  ,{align:'left', width: 120});
        doc.rect(config.xPos+config.width+10, doc.y-7,5,5);
        doc.fill(data.datasets[j].fillColor);
    }


}

//Populate an array of all the labels by interpolating the string.
function populateLabels(labelTemplateString, labels, numberOfSteps, graphMin, stepValue) {
    if (labelTemplateString) {
        //Fix floating point errors by setting to fixed the on the same decimal as the stepValue.
        for (var i = 1; i < numberOfSteps + 1; i++) {
            labels.push((graphMin + (stepValue * i)).toFixed(getDecimalPlaces(stepValue)));
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
