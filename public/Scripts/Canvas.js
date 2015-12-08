var barGraph = (function () {
    var CANVAS_WIDTH = 500,
        CANVAS_HEIGHT = 360,
        MAX_BAR_HEIGHT = 400,
        data;

    var canvas, context;

    return {
        setup: function () {
            canvas = document.getElementById('barGraph');
            canvas.width = CANVAS_WIDTH;
            canvas.style.width = CANVAS_WIDTH;
            canvas.height = CANVAS_HEIGHT;
            context = canvas.getContext("2d");
        },
        drawLine: function (color, startPoint, endPoint) {
            context.beginPath();
            context.strokeStyle = color;
            context.moveTo(startPoint.x, startPoint.y);
            context.lineTo(endPoint.x, endPoint.y);
            context.stroke();
        },
        drawBar: function (color, dimensionsObject) {
            /* 
                Dimensions Object:
                    x, y, width, height
            */
            context.fillStyle = color;
            context.fillRect(dimensionsObject.x, dimensionsObject.y, dimensionsObject.width, dimensionsObject.height);
        },
        drawText: function (text, dimensionsObject) {
            context.textAlign = dimensionsObject.textAlign || 'center';
            context.fillStyle = 'black';
            context.font = '14px sans-serif';
            context.fillText(text, dimensionsObject.x, dimensionsObject.y);
        },
        clearStuff: function () {
            context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        },
        loadData: function (dataChunk) {
            data = dataChunk;
        },
        run: function () {
            console.log('bar graph script loaded!');
            barGraph.setup();
        }
    };
}());

function Bar(name, value) {
    this.name = name;
    this.value = value;
}

Bar.prototype.setColor = function (barColor) {
    this.barColor = barColor;
};

function BarPair(name1, name2, pairName) {
    this.bar1 = new Bar(name1, 0);
    this.bar2 = new Bar(name2, 0);
    this.pairName = pairName;
};

BarPair.prototype.setValues = function (value1, value2) {
    this.bar1.value = value1;
    this.bar2.value = value2;
};

BarPair.prototype.toString = function () {
    return this.bar1.name + ": " + this.bar1.value + "\n" + this.bar2.name + ": " + this.bar2.value;
};

BarPair.prototype.draw = function (dimensionsObject, maxValue, maxHeight) {
    /* 
        Dimensions:
            X, Y, width, bottomY
    */
    var color1 = this.bar1.barColor || "blue",
        color2 = this.bar2.barColor || "red";
    var y1 = dimensionsObject.y,
        y2 = dimensionsObject.y;
    var height1 = (this.bar1.value / maxValue) * maxHeight;
    var height2 = (this.bar2.value / maxValue) * maxHeight;
    if (height1 > maxHeight) {
        height1 = maxHeight;
    }
    if (height2 > maxHeight) {
        height2 = maxHeight;
    }
    y1 = dimensionsObject.bottomY - height1;
    y2 = dimensionsObject.bottomY - height2;
    barGraph.drawBar(color1, {
        x: dimensionsObject.x,
        y: y1,
        width: dimensionsObject.width,
        height: height1
    });
    barGraph.drawBar(color2, {
        x: dimensionsObject.x + dimensionsObject.width,
        y: y2,
        width: dimensionsObject.width,
        height: height2
    });
    barGraph.drawText(this.pairName, {
        x: dimensionsObject.x + dimensionsObject.width,
        y: y1 + height1 + 20
    });
    barGraph.drawText(this.bar1.value, {
        x: dimensionsObject.x + dimensionsObject.width / 2,
        y: y1 - 5
    });
    barGraph.drawText(this.bar2.value, {
        x: dimensionsObject.x + (dimensionsObject.width * 1.5),
        y: y2 - 5
    });
};

var dataObject = {
    Human: {
        number: 1,
        victims: 10
    },
    Vampire: {
        number: 2,
        victims: 5
    },
    Werewolf: {
        number: 4,
        victims: 8
    },
    Zombie: {
        number: 10,
        victims: 3
    }
};

function parseData(targetData) {
    var newDataObject = {
        Human: {
            number: 0,
            victims: 0
        },
        Vampire: {
            number: 0,
            victims: 0
        },
        Werewolf: {
            number: 0,
            victims: 0
        },
        Zombie: {
            number: 0,
            victims: 0
        }
    };
    for (var i = 0; i < targetData.length; i++) {
        var target = targetData[i];
        newDataObject[
            target.species
            ].number++;
        newDataObject[
            target.species
            ].victims += target.victims;
    }
    return newDataObject;
}

function processData(targetData) {
    var newData = parseData(targetData);
    if (JSON.stringify(dataObject) !== JSON.stringify(newData)) {
        dataObject = newData;
        barGraph.clearStuff();
        drawBars(dataObject);
    }
}

function drawBars(targetData) {
    var humanBars = new BarPair("Number", "Victims", "Humans");
    humanBars.setValues(targetData.Human.number, targetData.Human.victims);

    var vampBars = new BarPair("Number", "Victims", "Vampires");
    vampBars.setValues(targetData.Vampire.number, targetData.Vampire.victims);

    var wereBars = new BarPair("Number", "Victims", "Werewolves");
    wereBars.setValues(targetData.Werewolf.number, targetData.Werewolf.victims);

    var zomBars = new BarPair("Number", "Victims", "Zombies");
    zomBars.setValues(targetData.Zombie.number, targetData.Zombie.victims);

    var maxValue = 10,
        maxHeight = 300,
        startX = 100,
        xInc = 80,
        width = 20,
        botY = 320;

    var stringSet = ["Human", "Vampire", "Werewolf", "Zombie"];

    for (var i = 0; i < stringSet.length; i++) {
        while (targetData[stringSet[i]].number > maxValue || targetData[stringSet[i]].victims > maxValue) {
            maxValue += 10;
        }
    }

    var topLeft = {
            x: startX,
            y: botY - maxHeight
        },
        botLeft = {
            x: startX,
            y: botY
        },
        botRight = {
            x: startX + (xInc * 3) + (width * 4),
            y: botY
        },
        topRight = {
            x: startX + (xInc * 3) + (width * 4),
            y: botY - maxHeight
        },
        borderColor = 'black',
        lineColor = 'grey',
        yInc = maxHeight / 10,
        valInc = maxValue / 10;

    var barLeft = {
            x: botLeft.x,
            y: botLeft.y - yInc
        },
        barRight = {
            x: botRight.x,
            y: botRight.y - yInc
        };

    for (var i = 0; i < 10; i++) {
        barGraph.drawLine(lineColor, barLeft, barRight);
        barGraph.drawText(valInc + valInc * i, {
            x: barLeft.x - 6,
            y: barLeft.y + 5,
            textAlign: 'right'
        });
        barLeft.y -= (yInc);
        barRight.y -= (yInc);
    }

    humanBars.draw({
        x: startX + (xInc * 0) + (width * 1),
        width: width,
        bottomY: botY
    }, maxValue, maxHeight);

    vampBars.draw({
        x: startX + (xInc * 1) + (width * 1),
        width: width,
        bottomY: botY
    }, maxValue, maxHeight);

    wereBars.draw({
        x: startX + (xInc * 2) + (width * 1),
        width: width,
        bottomY: botY
    }, maxValue, maxHeight);

    zomBars.draw({
        x: startX + (xInc * 3) + (width * 1),
        width: width,
        bottomY: botY
    }, maxValue, maxHeight);

    barGraph.drawLine(borderColor, botLeft, botRight);
    barGraph.drawLine(borderColor, botLeft, topLeft);
    barGraph.drawLine(borderColor, topLeft, topRight);
    barGraph.drawLine(borderColor, topRight, botRight);
}

function updateGraph() {
    var request = new XMLHttpRequest();
    request.open('GET', '/JSON', true);
    request.onload = function () {
        console.log('loaded!');
        if (request.status >= 200 && request.status < 400) {
            var data = JSON.parse(request.responseText);
            barGraph.loadData(data);
            processData(data);
        } else {
            console.log(request);
        }
    }
    request.send();
}

function run() {
    barGraph.run();
    updateGraph();
    setInterval(updateGraph, 3000);
}

window.addEventListener("load", run);