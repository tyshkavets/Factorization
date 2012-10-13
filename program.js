/**
 * Created with JetBrains WebStorm.
 * User: s.tyshkovets
 * Date: 09.10.12
 * Time: 19:09
 */

// Root namespace
var Tyshkovets = {};

Tyshkovets.NamespaceProvider = ( function(namespaceProvider, window, undefined) {

    namespaceProvider.namespace = function(namespaceString) {
        var parts = namespaceString.split('.'),
            parent = window,
            currentPart = '';

        for(var i = 0, length = parts.length; i < length; i++) {
            currentPart = parts[i];
            parent[currentPart] = parent[currentPart] || {};
            parent = parent[currentPart];
        }

        return parent;
    };

    return namespaceProvider;

})(Tyshkovets.NamespaceProvider || {}, window);

Tyshkovets.IntegerMath = (function(integerMath, window, undefined) {

    function lesserPrimeDivisor(number) {
        if (isNaN(number) || !isFinite(number)) return NaN;
        if (number == 0) return 0;
        if (number == 1) return 1;
        if (number % 2 == 0) return 2;
        if (number % 3 == 0) return 3;
        if (number % 5 == 0) return 5;
        if (number % 7 == 0) return 7;

        var maxPrimeNumber = Math.sqrt(number);

        for (var i = 11; i <= maxPrimeNumber; i+= 10) {
            if (number % i == 0) return i;
            if (number % (i + 2) == 0) return i + 2;
            if (number % (i + 6) == 0) return i + 6;
            if (number % (i + 8) == 0) return i + 8;
        }

        return number;
    }

    integerMath.FactorDistribution = new function(number) {
        var lesserFactor = lesserPrimeDivisor(number);
        if (number == lesserFactor) {
            return [].concat(number);
        }

        return this.FactorDistribution(number / lesserFactor).concat(lesserFactor);
    };

    return integerMath;

})(Tyshkovets.IntegerMath || {}, window);

Tyshkovets.Canvas = ( function($, window, undefined) {

    var _context;

    var canvasConstructor = function CanvasConstructor(canvasId) {
        _context = $('#' + canvasId)[0].getContext('2d');
    };

    canvasConstructor.prototype.drawCircle = function (centerX, centerY, radius) {
        _context.arc(centerX, centerY, radius, 0, 2 * Math.PI, true);
        _context.fill();
    };

    return canvasConstructor;

})(jQuery, window);

$(document).ready(function(){
    drawItems(Tyshkovets.IntegerMath.FactorDistribution(700), 500, 500, 500, true, 0.8);
});


function drawItems(arrayOfItems, centerX, centerY, radius, booleanShift, singleItemDistance) {

    var context = $('#targetCanvas')[0].getContext('2d');

    var numberOfItems = 0;
    if (arrayOfItems.length > 0) {
        numberOfItems = arrayOfItems[0];
        var radiusOfInnerPath = radius / (1 + Math.sin(Math.PI / numberOfItems));
    } else {
        var canvas = new Tyshkovets.Canvas('targetCanvas');
        canvas.drawCircle(centerX, centerY, radius);
        return;
    }

    var smallerRadius = radiusOfInnerPath * Math.sin(Math.PI / numberOfItems);

    for (var i = 0; i < numberOfItems; i++) {
        var angleShift = i * 2 * Math.PI / numberOfItems;

        if (numberOfItems === 2 && booleanShift === true) {
            angleShift += Math.PI / 2;
        }

        var nextBooleanShiftValue = numberOfItems === 2 ? !booleanShift : booleanShift;

        var innerCenterX = centerX + radiusOfInnerPath * Math.cos(angleShift);
        var innerCenterY = centerY + radiusOfInnerPath * Math.sin(angleShift);

        if (arrayOfItems.length == 1) {
            var singleItemRadius = smallerRadius * singleItemDistance;
            var canvas = new Tyshkovets.Canvas('targetCanvas');
            canvas.drawCircle(innerCenterX, innerCenterY, singleItemRadius);
        } else {
            var arrClone = arrayOfItems.slice(0);
            arrClone.shift();
            drawItems(arrClone, innerCenterX, innerCenterY, smallerRadius, nextBooleanShiftValue, singleItemDistance);
        }
    }
}

