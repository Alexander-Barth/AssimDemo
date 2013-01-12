/*
  Copyright (C) 2012 Alexander Barth <a.barth at ulg.ac.be>.

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as published
  by the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/*jslint browse: true, continue : true, devel : true, indent : 4, maxerr : 50, newcap : false, nomen : true, plusplus : false, regexp : true, sloppy : true, vars : true, white : false, nomen: false */
/*global jQuery: false, $: false, numeric: false, MathJax */


var matplot = {};

// creates a global "addwheelListener" method
// example: addWheelListener( elem, function( e ) { console.log( e.deltaY ); e.preventDefault(); } );
// https://developer.mozilla.org/en-US/docs/Mozilla_event_reference/wheel

(function(window,document) {
 
    var prefix = "", _addEventListener, onwheel, support;
 
    // detect event model
    if ( window.addEventListener ) {
        _addEventListener = "addEventListener";
    } else {
        _addEventListener = "attachEvent";
        prefix = "on";
    }
 
    // detect available wheel event
    if ( document.onmousewheel !== undefined ) {
        // Webkit and IE support at least "mousewheel"
        support = "mousewheel"
    }
    try {
        // Modern browsers support "wheel"
        WheelEvent("wheel");
        support = "wheel";
    } catch (e) {}
    if ( !support ) {
        // let's assume that remaining browsers are older Firefox
        support = "DOMMouseScroll";
    }
 
    window.addWheelListener = function( elem, callback, useCapture ) {
        _addWheelListener( elem, support, callback, useCapture );
 
        // handle MozMousePixelScroll in older Firefox
        if( support == "DOMMouseScroll" ) {
            _addWheelListener( elem, "MozMousePixelScroll", callback, useCapture );
        }
    };
 
    function _addWheelListener( elem, eventName, callback, useCapture ) {
        elem[ _addEventListener ]( prefix + eventName, support == "wheel" ? callback : function( originalEvent ) {
            !originalEvent && ( originalEvent = window.event );
 
            // create a normalized event object
            var event = {
                // keep a ref to the original event object
                originalEvent: originalEvent,
                target: originalEvent.target || originalEvent.srcElement,
                type: "wheel",
                deltaMode: originalEvent.type == "MozMousePixelScroll" ? 0 : 1,
                deltaX: 0,
                delatZ: 0,
                preventDefault: function() {
                    originalEvent.preventDefault ?
                        originalEvent.preventDefault() :
                        originalEvent.returnValue = false;
                }
            };
             
            // calculate deltaY (and deltaX) according to the event
            if ( support == "mousewheel" ) {
                event.deltaY = - 1/40 * originalEvent.wheelDelta;
                // Webkit also support wheelDeltaX
                originalEvent.wheelDeltaX && ( event.deltaX = - 1/40 * originalEvent.wheelDeltaX );

                // Alex: position of mouse during scroll event
                event.pageX = originalEvent.pageX;
                event.pageY = originalEvent.pageY;
                event.clientX = originalEvent.clientX;
                event.clientY = originalEvent.clientY;
            } else {
                event.deltaY = originalEvent.detail;
            }
 
            // it's time to fire the callback
            return callback( event );
 
        }, useCapture || false );
    }
 
})(window,document);


matplot.colormaps = {'jet':
            [
   [0.000000000000000,0.000000000000000,0.500000000000000],
   [0.000000000000000,0.000000000000000,0.563492063492063],
   [0.000000000000000,0.000000000000000,0.626984126984127],
   [0.000000000000000,0.000000000000000,0.690476190476190],
   [0.000000000000000,0.000000000000000,0.753968253968254],
   [0.000000000000000,0.000000000000000,0.817460317460317],
   [0.000000000000000,0.000000000000000,0.880952380952381],
   [0.000000000000000,0.000000000000000,0.944444444444444],
   [0.000000000000000,0.007936507936508,1.000000000000000],
   [0.000000000000000,0.071428571428571,1.000000000000000],
   [0.000000000000000,0.134920634920635,1.000000000000000],
   [0.000000000000000,0.198412698412698,1.000000000000000],
   [0.000000000000000,0.261904761904762,1.000000000000000],
   [0.000000000000000,0.325396825396825,1.000000000000000],
   [0.000000000000000,0.388888888888889,1.000000000000000],
   [0.000000000000000,0.452380952380952,1.000000000000000],
   [0.000000000000000,0.515873015873016,1.000000000000000],
   [0.000000000000000,0.579365079365079,1.000000000000000],
   [0.000000000000000,0.642857142857143,1.000000000000000],
   [0.000000000000000,0.706349206349206,1.000000000000000],
   [0.000000000000000,0.769841269841270,1.000000000000000],
   [0.000000000000000,0.833333333333333,1.000000000000000],
   [0.000000000000000,0.896825396825397,1.000000000000000],
   [0.000000000000000,0.960317460317460,1.000000000000000],
   [0.023809523809524,1.000000000000000,0.976190476190476],
   [0.087301587301587,1.000000000000000,0.912698412698413],
   [0.150793650793651,1.000000000000000,0.849206349206349],
   [0.214285714285714,1.000000000000000,0.785714285714286],
   [0.277777777777778,1.000000000000000,0.722222222222222],
   [0.341269841269841,1.000000000000000,0.658730158730159],
   [0.404761904761905,1.000000000000000,0.595238095238095],
   [0.468253968253968,1.000000000000000,0.531746031746032],
   [0.531746031746032,1.000000000000000,0.468253968253968],
   [0.595238095238095,1.000000000000000,0.404761904761905],
   [0.658730158730159,1.000000000000000,0.341269841269841],
   [0.722222222222222,1.000000000000000,0.277777777777778],
   [0.785714285714286,1.000000000000000,0.214285714285714],
   [0.849206349206349,1.000000000000000,0.150793650793651],
   [0.912698412698413,1.000000000000000,0.087301587301587],
   [0.976190476190476,1.000000000000000,0.023809523809524],
   [1.000000000000000,0.960317460317460,0.000000000000000],
   [1.000000000000000,0.896825396825397,0.000000000000000],
   [1.000000000000000,0.833333333333333,0.000000000000000],
   [1.000000000000000,0.769841269841270,0.000000000000000],
   [1.000000000000000,0.706349206349207,0.000000000000000],
   [1.000000000000000,0.642857142857143,0.000000000000000],
   [1.000000000000000,0.579365079365080,0.000000000000000],
   [1.000000000000000,0.515873015873016,0.000000000000000],
   [1.000000000000000,0.452380952380953,0.000000000000000],
   [1.000000000000000,0.388888888888889,0.000000000000000],
   [1.000000000000000,0.325396825396826,0.000000000000000],
   [1.000000000000000,0.261904761904762,0.000000000000000],
   [1.000000000000000,0.198412698412699,0.000000000000000],
   [1.000000000000000,0.134920634920635,0.000000000000000],
   [1.000000000000000,0.071428571428572,0.000000000000000],
   [1.000000000000000,0.007936507936508,0.000000000000000],
   [0.944444444444445,0.000000000000000,0.000000000000000],
   [0.880952380952381,0.000000000000000,0.000000000000000],
   [0.817460317460318,0.000000000000000,0.000000000000000],
   [0.753968253968254,0.000000000000000,0.000000000000000],
   [0.690476190476191,0.000000000000000,0.000000000000000],
   [0.626984126984127,0.000000000000000,0.000000000000000],
   [0.563492063492064,0.000000000000000,0.000000000000000],
   [0.500000000000000,0.000000000000000,0.000000000000000]]
           };


matplot.peaks = function() {
    var i,j,x=[],y=[],z=[];
    var f = function(x,y) {
        return 3*(1-x)*(1-x)*Math.exp(-x*x - (y+1)*(y+1))
            - 10*(x/5 - x*x*x - Math.pow(y,5))*Math.exp(-x*x-y*y)
            - 1/3*Math.exp(-(x+1)*(x+1) - y*y); };

    for (i=0; i < 49; i++) {
        x[i] = [];
        y[i] = [];
        z[i] = [];

        for (j=0; j < 49; j++) {
            x[i][j] = -3 + i/8;
            y[i][j] = -3 + j/8;
            z[i][j] = f(x[i][j],y[i][j]);
        }
    }

    return {x: x, y: y, z:z};
};

matplot.range = function (start,end,step) {
    var i, r = [];
    step = step || 1;

    for (i=start; i<=end; i+=step) {
        r.push(i);
    }
    return r;
};

// Propose about n ticks for range (min,max)
// Code taken from yapso

matplot.ticks = function ticks(min,max,n) {
    var nt, range, dt, base, sdt, t0, i;

    // a least 2 ticks
    if (n<2) {
        n = 2;
    }

    range = max-min;
    dt = range/n;

    // transform dt in "scientific notation"
    // dt = sdt * 10^(log10(base))

    base = Math.pow(10.0,Math.floor(Math.log(dt)/Math.LN10) );
    sdt = dt/base;

    // pefered increments

    if (sdt <= 1.5) {
	sdt = 1;
    }
    else if (sdt < 2.5) {
	sdt = 2;
    }
    else if (sdt <= 4) {
	sdt = 3;
    }
    else if (sdt <= 7) {
	sdt = 5;
    }
    else {
	sdt = 10;
    }

    dt = sdt * base;

    // the first label will be:  ceil(min/dt)*dt
    // the last label will be: floor(max/dt)*dt

    t0 = Math.ceil(min/dt)*dt;

    // the difference between first and last label
    // gives the number of labels

    nt = Math.round(Math.floor(max/dt) - Math.ceil(min/dt) +1);

    var t = new Array(nt);

    for(i=0;i<nt;i++) {
	t[i] = t0 + i*dt;

	// attempt to remove spurious decimals
	var eps = dt;
	t[i] = Math.round(t[i]/eps)*eps;
	if (Math.abs(t[i])<1e-14) {
            t[i]=0;
        }
    }

    return t;

};

matplot.remove_spurious_decimals = function(s) {
    var re1,re2,s2,s3;

    if (typeof(s) === "number") {
	s = s.toString();
    }

    re1 = new RegExp("(\\.[0-9]*[1-9]+)0{4,}.*$");

    s2 = s.replace(re1,"$1");

    re2 = new RegExp("(\\.)0{4,}.*$");
    s3 = s2.replace(re2,"$1");
    return s3;
};

// create DOM nodes with the tag name tag and the given attributes (attribs) and children.
// attribs: fields are attributes of the new element. Undefined fields are ignored.
//
//

matplot.mk = function mk(xmlns,tag,attribs,children) {
    var elem, child, a, c, style, obj, s;

    attribs = attribs || {};
    children = children || [];

    if (xmlns === '') {
        elem = document.createElement(tag);
    }
    else {
        elem = document.createElementNS(xmlns, tag);
    }

    for (a in attribs) {
        if (attribs.hasOwnProperty(a) && attribs[a] !== undefined) {
            if (typeof attribs[a] === 'function') {
                // event handler
                elem[a] = attribs[a];
            }
            else if (a === 'style' && typeof attribs[a] === 'object') {
                // style attribute can be a object
                obj = attribs[a];
                style = '';

                for (s in obj) {
                    if (obj.hasOwnProperty(s)) {
                        // ignore style if undefined
                        if (obj[s] !== undefined) {
                            style += s + ': ' + obj[s] + ';';
                        }
                    }
                }

                elem.setAttributeNS(null, a, style);
            }
            else {
                elem.setAttributeNS(null, a, attribs[a]);
            }
        }
    }

    for (c in children) {
        if (children.hasOwnProperty(c)) {
            if (typeof children[c] === 'string') {
                child = document.createTextNode(children[c]);
            }
            else {
                child = children[c];
            }

            elem.appendChild(child);
        }
    }
    return elem;
};

matplot.html = function mk(tag,attribs,children) {
    return matplot.mk('',tag,attribs,children);
}


matplot.SVGCanvas = function SVGCanvas(container,width,height) {
    this.xmlns = "http://www.w3.org/2000/svg";
    this.width = width;
    this.height = height;

    this.container = container;
    this.container.appendChild(
        this.svg = this.mk('svg',{width: width, 
                                  height: height,
                                  style: {'user-select': 'none',
                                          '-webkit-user-select': 'none'}
                                 },
                           [this.axis = this.mk('g',{})]));

    this.parentStack = [this.axis];

    this.idconter = 0;
};

matplot.SVGCanvas.prototype.id = function () {
    return 'matplot' + (this.idconter++);
};

matplot.SVGCanvas.prototype.push = function (elem) {
    this.parentStack.push(elem);
};

matplot.SVGCanvas.prototype.pop = function () {
    return this.parentStack.pop();
};

matplot.SVGCanvas.prototype.parent = function () {
    return this.parentStack[this.parentStack.length-1];
};

matplot.SVGCanvas.prototype.mk = function mk(tag,attribs,children) {
    var xmlns = "http://www.w3.org/2000/svg";
    return matplot.mk(xmlns,tag,attribs,children);
};

matplot.SVGCanvas.prototype.append = function(elem) {

};

matplot.SVGCanvas.prototype.remove = function(elem) {
    this.parent().removeChild(elem);
};

matplot.SVGCanvas.prototype.clear = function() {
    while (this.parent().firstChild) {
        this.parent().removeChild(this.parent().firstChild);    
    }
};

matplot.SVGCanvas.prototype.clipRect = function(x,y,w,h) {
    var id = this.id();

    this.parent().appendChild(
        this.mk('defs',{},[
            this.mk('clipPath',{id: id},[
                this.mk('rect',{x: x, y:y, width: w, height: h},[])
            ])
        ]));
    
    this.push(this.group({'clip-path': 'url(#' + id + ')'}))
};

matplot.SVGCanvas.prototype.group = function(style) {
    var group;
    style = style || {};

    this.parent().appendChild(
        group = this.mk('g',
                        {'clip-path': style['clip-path']}));

    return group;
};

matplot.SVGCanvas.prototype.rect = function(x,y,width,height,style) {
    var rect;
    style = style || {};

    this.parent().appendChild(
        rect = this.mk('rect',
                       {x: x,
                        y: y,
                        width: width,
                        height: height,
                        onclick: style.onclick,
                        style: {
                            'fill': style.fill || 'none',
                            'fill-opacity': style['fill-opacity'],
                            'pointer-events': style['pointer-events'],
                            'stroke':  style.stroke || 'black'}
                       }));

    return rect;
};


matplot.SVGCanvas.prototype.circle = function(x,y,radius,style) {
    var circle;
    style = style || {};

    this.parent().appendChild(
        circle = this.mk('circle',
                         {cx: x,
                          cy: y,
                          r: radius,
                          onclick: style.onclick,
                          style: {
                              'fill': style.fill || 'none',
                              'stroke':  style.stroke || 'black',
                              'pointer-events': style['pointer-events']
                          }
                         }));

    return circle;
};



matplot.SVGCanvas.prototype.polygon = function(x,y,style) {
    var polygon, points = '', i;

    for (i = 0; i < x.length; i++) {
        points += x[i] + ',' + y[i] + ' ';
    }

    this.parent().appendChild(
        polygon = this.mk('polygon',
                         {points: points,
                          onclick: style.onclick,
                          style: {fill: style.fill, stroke: style.stroke}
                         }
                         ));

    return polygon;
};

matplot.SVGCanvas.prototype.textBBox = function(string,style) {
    var text, FontSize, FontFamily, bbox;

    style = style || {};
    FontSize = style.FontSize || 18;
    FontFamily = style.FontFamily || 'sans-serif';

    // text should not be visible
    text = this.mk('text',{'x': -10000,
                              'y': 0,
                              'font-family': FontFamily,
                              'font-size': FontSize},[string]);

    this.parent().appendChild(text);
    bbox = text.getBBox();
    this.parent().removeChild(text);

    return {width: bbox.width, height: bbox.height};
};

matplot.SVGCanvas.prototype.text = function(x,y,string,style) {
    var text, offseti, offsetj, FontSize, FontFamily, color, HorizontalAlignment, VerticalAlignment;
    var TextAnchor, dy = 0;

    style = style || {};
    offseti = style.offseti || 0;
    offsetj = style.offsetj || 0;
    FontSize = style.FontSize || 18;
    FontFamily = style.FontFamily || 'sans-serif';
    color = style.color || 'black';
    HorizontalAlignment = style.HorizontalAlignment || 'left';
    VerticalAlignment = style.VerticalAlignment || 'baseline';


    //console.log('offsetj',offsetj,VerticalAlignment);
    if (HorizontalAlignment === 'left') {
        TextAnchor = 'start';
    }
    else if (HorizontalAlignment === 'center') {
        TextAnchor = 'middle';
    }
    else if (HorizontalAlignment === 'right') {
        TextAnchor = 'end';
    }
    else {
        console.error(HorizontalAlignment);
    }

    if (VerticalAlignment === 'top') {
        dy = FontSize;
        //dy = this.textBBox(string).height;
    }
    else if (VerticalAlignment === 'middle') {
        dy = FontSize/2-1.5;
        //dy = this.textBBox(string).height/2;
    }
    else if (VerticalAlignment === 'baseline') {
        dy = 0;
    }

    this.parent().appendChild(
        text = this.mk('text',{'x': x+offseti,
                   'y': y+offsetj,
                   'font-family': FontFamily,
                   'font-size': FontSize,
                   'text-anchor': TextAnchor,
                   'dy': dy,
                   'fill': color},
           [string] ));
    return text;
};


matplot.SVGCanvas.prototype.line = function(x,y,style) {
    var polyline, points = '', i, linespec, dasharray;

    linespec = style.linespec || '-';

    if (linespec === 'none') {
        return;
    }
    else if (linespec === '-') {
        dasharray = 'none';
    }
    else if (linespec === '-.') {
        dasharray = '15,5,1,5';
    }
    else if (linespec === ':') {
        dasharray = '1,3';
    }
    else if (linespec === '--') {
        dasharray = '15,5';
    }

    for (i = 0; i < x.length; i++) {
        points += x[i] + ',' + y[i] + ' ';
    }

    this.parent().appendChild(
        polyline = this.mk('polyline',
                           {points: points,
                            onclick: style.onclick,
                            style: {'fill': 'none',
                                    'stroke': (style.color || 'black'),
                                    'stroke-width': (style.width || 1),
                                    'stroke-dasharray': dasharray}
                           }
                          ));


    return polyline;
};



matplot.Surface = function Surface(x,y,z,c,style) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.c = c;
    this.style = style || {};
};

matplot.Surface.prototype.lim = function(what) {
    var i, j, min, max, tmp = this[what];
    min = max = tmp[0][0];

    for (i=0; i<tmp.length; i++) {
        for (j=0; j<tmp[0].length; j++) {
            min = Math.min(min,tmp[i][j]);
            max = Math.max(max,tmp[i][j]);
        }
    }
    return [min,max];
};

matplot.Surface.prototype.draw = function(axis) {
    var i,j;

    for (i=0; i<this.x.length-1; i++) {
        for (j=0; j<this.x[0].length-1; j++) {
            // does not work for curvilinear grid
            /*axis.rect([this.x[i][j],this.x[i+1][j]],
                     [this.y[i][j],this.y[i+1][j+1]],
                     this.c[i][j]);*/

            axis.polygon([this.x[i][j],this.x[i+1][j],this.x[i+1][j+1],this.x[i][j+1]],
                         [this.y[i][j],this.y[i+1][j],this.y[i+1][j+1],this.y[i][j+1]],
                         [this.z[i][j],this.z[i+1][j],this.z[i+1][j+1],this.z[i][j+1]],
                         this.c[i][j]);

        }
    }
};


matplot.Line = function Line(x,y,z,style) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.style = style || {};
};

matplot.Line.prototype.lim = function(what) {
    var i, min, max, tmp = this[what];

    if (what === 'c') {
        return [NaN,NaN];
    }
    min = max = tmp[0];

    for (i=0; i<tmp.length; i++) {
        min = Math.min(min,tmp[i]);
        max = Math.max(max,tmp[i]);
    }
    return [min,max];
};

matplot.Line.prototype.draw = function(axis) {
    var i,j;

    axis.drawLine(this.x,this.y,this.z,this.style);
};

matplot.ColorMap = function ColorMap(cLim,type) {
    this.cLim = cLim;
    this.type = type || 'jet';
    this.cm = matplot.colormaps[this.type];
};

matplot.ColorMap.prototype.get = function (v) {
    var c=[];
    var vs = (v-this.cLim[0])/(this.cLim[1]-this.cLim[0]);
    c[0] = vs;
    c[1] = 1;
    c[2] = 1;

    var index = Math.round(vs * this.cm.length);
    index = Math.max(Math.min(index,this.cm.length-1),0);
    c = this.cm[index];

    return 'rgb(' + Math.round(255*c[0]) + ',' + Math.round(255*c[1]) + ',' + Math.round(255*c[2]) + ')';
};

// Axis(fig,x,y,w,h)
// create a new axes in figure fig
// at location x,y and width w and height h
// x,y,w,h are fraction of the total figure height and width

matplot.Axis = function Axis(fig,x,y,w,h) {
    this.fig = fig;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.cmap = new matplot.ColorMap([-1,1]);
    this.FontFamily = "Verdana";
    this.FontSize = 15;
    this.color = 'black';
    this.children = [];

    this._projection = 'orthographic';

    // default properties of the x-axis
    this._xLim = [];
    this._xLimMode = 'auto';
    this.xLabel = '';
    this.xGrid = 'on';
    this.xDir = 'normal';
    this.xScale = 'linear';
    this.xMinorGrid = 'off';
    this.xMinorTick = 'off';
    this.xColor = [0,0,0];
    this.xTickLen = 10;
    this.xTickMode = 'auto';
    this.xTick = [];
    this.xTickLabelMode = 'auto';
    this.xTickLabel = [];
    this.xAxisLocation = 'bottom';
//    this.xAxisLocation = 'top';

    this._yLim = [];
    this._yLimMode = 'auto';
    this.yLabel = '';
    this.yGrid = 'on';
    this.yDir = 'normal';
    this.yScale = 'linear';
    this.yMinorGrid = 'off';
    this.yMinorTick = 'off';
    this.yColor = [0,0,0];
    this.yTickLen = 10;
    this.yTickMode = 'auto';
    this.yTick = [];
    this.yTickLabelMode = 'auto';
    this.yTickLabel = [];
    this.yAxisLocation = 'left';
//    this.xAxisLocation = 'right';

    this._zLim = [];
    this._zLimMode = 'auto';
    this.zLabel = '';
    this.zGrid = 'on';
    this.zDir = 'normal';
    this.zScale = 'linear';
    this.zMinorGrid = 'off';
    this.zMinorTick = 'off';
    this.zColor = [0,0,0];
    this.zTickLen = 10;
    this.zTickMode = 'auto';
    this.zTick = [];
    this.zTickLabelMode = 'auto';
    this.zTickLabel = [];

    this._cLim = [];
    this._cLimMode = 'auto';

    this._DataAspectRatioMode = 'auto';
    this._DataAspectRatio = [1,1,1];

    this._CameraPosition = [0,0,10];
    this._CameraTarget = [0,0,0];
    this._CameraUpVector = [0,1,0];
    this._CameraViewAngle = 10.3396;

    this.xLabelFormat = function(x) {return matplot.remove_spurious_decimals(x.toString());};
    this.yLabelFormat = function(x) {return matplot.remove_spurious_decimals(x.toString());};
    this.zLabelFormat = function(x) {return matplot.remove_spurious_decimals(x.toString());};

    this.gridLineStyle = ':';

    this.annotationNDigits = 3;
    this.annotationFormat = function(x) {
        var s1 = x.toString(),s2 = x.toPrecision(this.annotationNDigits);
        if (s2.length < s1.length) {
            return s2;
        }
        else {
            return s1;
        }
    };
    this.annotatedElements = [];
    this._annotations = [];
};

function getterSetterMode(func,prop,mode) {
    return function (data) {
        if (arguments.length === 0) {
            // get
            if (this[mode] === 'auto') {
                return func.call(this);
            }
            else {
                return this[prop];
            }
        }
        else {
            // set
            this[prop] = data;
            this[mode] = 'manual';
        }

        return this;
    };
}

function getterSetterVal(prop,vals) {
    return function (data) {
        if (arguments.length === 0) {
            // get
            return this[prop];
        }
        else {
            // set
            if (vals.indexOf(data) === -1) {
                throw 'Error: value of property ' + prop + ' should be one of ' +
                    vals.join(', ') + ' but got ' + data + '.';
            }
            else {
                this[prop] = data;
            }
        }

        return this;
    };
}

matplot.Axis.prototype.xLim = getterSetterMode(function() { return this.lim('x'); },'_xLim','_xLimMode');
matplot.Axis.prototype.yLim = getterSetterMode(function() { return this.lim('y'); },'_yLim','_yLimMode');
matplot.Axis.prototype.zLim = getterSetterMode(function() { return this.lim('z'); },'_zLim','_zLimMode');
matplot.Axis.prototype.cLim = getterSetterMode(function() { return this.lim('c'); },'_cLim','_cLimMode');

matplot.Axis.prototype.projection = getterSetterVal('_projection',['orthographic', 'perspective']);

matplot.Axis.prototype.xLimMode = getterSetterVal('_xLimMode',['auto','manual']);
matplot.Axis.prototype.yLimMode = getterSetterVal('_yLimMode',['auto','manual']);
matplot.Axis.prototype.zLimMode = getterSetterVal('_zLimMode',['auto','manual']);
matplot.Axis.prototype.cLimMode = getterSetterVal('_cLimMode',['auto','manual']);


matplot.Axis.prototype.xtick = getterSetterMode(function() { return this.xTick; },'xTick','xTickMode');
matplot.Axis.prototype.ytick = getterSetterMode(function() { return this.yTick; },'yTick','yTickMode');
matplot.Axis.prototype.ztick = getterSetterMode(function() { return this.zTick; },'zTick','zTickMode');


// makes a product of all matrices provided as arguments

matplot.prod = function (M) {
    var i;

    for (i=1; i < arguments.length; i++) {
        M = numeric.dot(M,arguments[i]);
    }

    return M;
};

matplot.cross = function (a,b) {
    var c = [];
    c[0] = a[1] * b[2] - a[2] * b[1];
    c[1] = a[2] * b[0] - a[0] * b[2];
    c[2] = a[0] * b[1] - a[1] * b[0];
    return c;
};

// http://publib.boulder.ibm.com/infocenter/pseries/v5r3/index.jsp?topic=/com.ibm.aix.opengl/doc/openglrf/gluProject.htm
// http://publib.boulder.ibm.com/infocenter/pseries/v5r3/index.jsp?topic=/com.ibm.aix.opengl/doc/openglrf/gluPerspective.htm

matplot.perspective = function (fovy, aspect, zNear, zFar) {
    var f = 1/Math.tan(fovy/2), z = zNear-zFar;
/*

                   (     f                                  )
                   |  ------   0       0            0       |
                   |  aspect                                |
                   |                                        |
                   |                                        |
                   |     0     f       0            0       |
                   |                                        |
                   |                                        |
                   |               zFar+zNear  2*zFar*zNear |
                   |     0     0   ----------  ------------ |
                   |               zNear-zFar   zNear-zFar  |
                   |                                        |
                   |                                        |
                   |     0     0      -1            0       |
                   (                                        )*/


/*    return [[ 0.638,    0,               0,                 0],
            [        0,    0.638,               0,                 0],
            [        0,    0,  1,  0],
            [        0,    0,              0,                 1]];
*/
/*    return [[ f/aspect,    0,               0,                 0],
            [        0,    f,               0,                 0],
            [        0,    0,  (zFar+zNear)/z,  (2*zFar*zNear)/z],
            [        0,    0,              -1,                 1]];
*/


    return [[ f/aspect,    0,               0,                 0],
            [        0,    f,               0,                 0],
            [        0,    0,  (zFar+zNear)/z,  (2*zFar*zNear)/z],
            [        0,    0,              -1,                 0]];


};

matplot.scale = function (s) {
    return [[s[0],0,0,0],
            [0,s[1],0,0],
            [0,0,s[2],0],
            [0,0,0,1]];

};

matplot.translate = function (dx) {
    return [[1,0,0,dx[0]],
            [0,1,0,dx[1]],
            [0,0,1,dx[2]],
            [0,0,0,1]];
};


// http://en.wikipedia.org/wiki/Orthographic_projection_%28geometry%29
// http://publib.boulder.ibm.com/infocenter/pseries/v5r3/index.jsp?topic=/com.ibm.aix.opengl/doc/openglrf/glOrtho.htm

// The box is translated so that its center is at the origin, then it is scaled to the unit cube which is defined by having a minimum corner at (-1,-1,-1) and a maximum corner at (1,1,1).

matplot.ortho = function (left, right, bottom, top, near, far) {
    return numeric.dot(
        matplot.scale([2/(right-left),2/(top-bottom),2/(far-near) ]),
        matplot.translate([-(right+left)/2,-(top+bottom)/2,-(far+near)/2 ]));

};


// http://publib.boulder.ibm.com/infocenter/pseries/v5r3/index.jsp?topic=/com.ibm.aix.opengl/doc/openglrf/gluLookAt.htm
/*
Let E be the 3d column vector (eyeX, eyeY, eyeZ).
Let C be the 3d column vector (centerX, centerY, centerZ).
Let U be the 3d column vector (upX, upY, upZ).

*/

matplot.LookAt = function(E,C,U) {
    var L, S, Up, M;
/*
Compute L = C - E.
Normalize L.
Compute S = L x U.
Normalize S.
Compute U' = S x L.
*/
    var nu = numeric;

    // L vector pointing from camera to target
    L = nu.sub(C,E);
    L = nu.mul(1/nu.norm2(L),L);

    // side direction to the "right" of L
    S = matplot.cross(L,U);
    S = nu.mul(1/nu.norm2(S),S);

    // new up vector
    Up = matplot.cross(S,L);

    // turn vector
    M = [[ S[0],  S[1],  S[2],  0],
         [Up[0], Up[1], Up[2],  0],
         [-L[0], -L[1], -L[2],  0],
         [0, 0, 0, 1]];

    // translate to the CameraPosition
    M = numeric.dot(M,matplot.translate([-E[0], -E[1], -E[2]]));

    return M;
};

matplot.Axis.prototype.zoomIn = function() {
    var xl = this.xLim();
    
}

matplot.Axis.prototype.project = function(x,y,z) {
    var i,j, b, v;
    z = z || 0;

    // Apply first ModelView matrix and then Projection matrix
    v = numeric.dot(this.projectionModelView,[x,y,z,1]);

    // Perspective division
    // http://www.glprogramming.com/red/chapter03.html
    
    v[0] = v[0]/v[3];
    v[1] = v[1]/v[3];
    v[2] = v[2]/v[3];
    v[3] = v[3]/v[3];

    // viewport transformation
    v = numeric.dot(this.viewport,v);

    return v;
};

matplot.Axis.prototype.unproject = function(i,j) {
    var i,j, b, v;
    v = [i,j,0,1];

    // inverse viewport transformation
    v = numeric.dot(this.invViewport,v);

    // inverse of ModelView matrix and then Projection matrix
    v = numeric.dot(this.invProjectionModelView,v);

    return v;
};

matplot.Axis.prototype.lim = function(what) {
    var i, min = +Infinity, max = -Infinity, range;

    if (this.children.length > 0) {
        for (i = 0; i<this.children.length; i++) {
            range = this.children[i].lim(what);
            min = Math.min(min,range[0]);
            max = Math.max(max,range[1]);
        }
    }
    else {
        min = max = NaN;
    }

    return [min,max];
};


matplot.Axis.prototype.plot = function(x,y,z,style) {
    var i, lastArg, args;

    // get a real array for arguments
    args = Array.prototype.slice.call(arguments);
    lastArg = args[args.length-1];

    // handle the case of missing style object
    if (Object.prototype.toString.call(lastArg) === '[object Array]' ) {
        args.push({});
        return matplot.Axis.prototype.plot.apply(this,args);
    }

    if (args.length === 2) {
        // missing x and z
        y = args[0];
        style = args[1];
        x = [];
        z = [];

        for (i = 0; i < y.length; i++) {
            x[i] = i;
            z[i] = 0;
        }
    }
    else if (args.length === 3) {
        // missing z
        x = args[0];
        y = args[1];
        style = args[2];
        z = [];

        for (i = 0; i < x.length; i++) {
            z[i] = 0;
        }
    }

    this.children.push(new matplot.Line(x,y,z,style));
};

matplot.Axis.prototype.pcolor = function(x,y,v) {
    var i, j, z = [];

    if (arguments.length === 1) {
        v = x;
        x = [];
        y = [];

        for (i=0; i<v.length; i++) {
            x[i] = [];
            y[i] = [];

            for (j=0; j<v[0].length; j++) {
                x[i][j] = i;
                y[i][j] = j;
            }
        }
    }

    for (i=0; i<v.length; i++) {
        z[i] = [];
        for (j=0; j<v[0].length; j++) {
            z[i][j] = 0;
        }
    }

    this.children.push(new matplot.Surface(x,y,z,v));
};

matplot.Axis.prototype.surf = function(x,y,z) {
    this.children.push(new matplot.Surface(x,y,z,z));
};

matplot.Axis.prototype.is2dim = function() {
    var _zrange = this._zrange;

    return (_zrange[0] === _zrange[1]);
};

matplot.Axis.prototype.draw = function() {
    var i, j, k, is2D;

    function nz_range(lim) {
        var min = lim[0], max = lim[1];
        if (min === max) {
            min = min-1;
            max = max+1;
        }
        return [min,max];
    }

    // real range of x, y and z variable (might be [0,0])
    this._xrange = this.xLim();
    this._yrange = this.yLim();
    this._zrange = this.zLim();


    // range for plotting which is never zero in length
    this._xLim = nz_range(this._xrange);
    this._yLim = nz_range(this._yrange);
    this._zLim = nz_range(this._zrange);

    this.cmap.cLim = this.cLim();

    is2D = this.is2dim();

    if (this.xTickMode === 'auto') {
        this.xTick = matplot.ticks(this._xLim[0],this._xLim[1],5);
    }

    if (this.xTickLabelMode === 'auto') {
        this.xTickLabel = this.xTick.map(this.xLabelFormat);
    }

    if (this.yTickMode === 'auto') {
        this.yTick = matplot.ticks(this._yLim[0],this._yLim[1],5);
    }

    if (this.yTickLabelMode === 'auto') {
        this.yTickLabel = this.yTick.map(this.yLabelFormat);
    }

    if (this.zTickMode === 'auto') {
        this.zTick = matplot.ticks(this._zLim[0],this._zLim[1],5);
    }

    if (this.zTickLabelMode === 'auto') {
        this.zTickLabel = this.zTick.map(this.zLabelFormat);
    }


    if (!is2D) {
        this._projection = 'perspective';
    }

    //console.log('is2D',is2D,this._zLim);
    // camera
    this._CameraTarget = [(this._xLim[0]+this._xLim[1])/2,
                          (this._yLim[0]+this._yLim[1])/2,
                          (this._zLim[0]+this._zLim[1])/2];

    var databox = [
        [this._xLim[0],this._yLim[0],this._zLim[0],1],
        [this._xLim[1],this._yLim[0],this._zLim[0],1],
        [this._xLim[0],this._yLim[1],this._zLim[0],1],
        [this._xLim[1],this._yLim[1],this._zLim[0],1],
        [this._xLim[0],this._yLim[0],this._zLim[1],1],
        [this._xLim[1],this._yLim[0],this._zLim[1],1],
        [this._xLim[0],this._yLim[1],this._zLim[1],1],
        [this._xLim[1],this._yLim[1],this._zLim[1],1]
    ];

    if (this._projection === 'orthographic') {
        // y-direction if upward
        this._CameraUpVector = [0,1,0];

        if (this._DataAspectRatioMode === 'auto') {
            this._DataAspectRatio = [1,this.h/this.w,1];
            this._DataAspectRatio = [(this._xLim[1]-this._xLim[0])/this.w,
                                     (this._yLim[1]-this._yLim[0])/this.h,
                                     1];
        }
        
        this._CameraPosition = [this._CameraTarget[0],
                                this._CameraTarget[1],
                                this._CameraTarget[2]+1];



    }
    else {
        this._CameraPosition = [-36.5257, -47.6012, 86.6025];
        //this._CameraPosition = [-27.394,  -35.701,   25.981];
        this._CameraPosition = [27.394,  35.701,   25.981];
        // z-direction if upward
	this._CameraUpVector = [0, 0, 1];
	this._CameraViewAngle = [13];
        this._DataAspectRatio = [1,1,2];
    }

    this.modelView = numeric.dot(
        matplot.LookAt(numeric.div(this._CameraPosition,this._DataAspectRatio),
                       numeric.div(this._CameraTarget,this._DataAspectRatio),
                       numeric.div(this._CameraUpVector,this._DataAspectRatio)),
        numeric.inv(matplot.scale(this._DataAspectRatio)));
    //console.log('modelView ',numeric.prettyPrint(this.modelView));


    var v, right = -Infinity, left = Infinity,
    top = -Infinity, bottom = Infinity,
    near = Infinity, far = -Infinity;
    
    for (var l = 0; l < 8; l++) {
        v = numeric.dot(this.modelView,databox[l]);
        console.log('v', v);
        left = Math.min(left,v[0]);
        right = Math.max(right,v[0]);

        top = Math.max(top,v[1]);
        bottom = Math.min(bottom,v[1]);
        
        near = Math.min(near,v[2]);
        far = Math.max(far,v[2]);
    }
        
    console.log('rl', left, right, bottom, top, near, far);
    var scale = this.h/2;
    
    if (this._projection === 'orthographic') {
        //this.projection = matplot.ortho(left, right, bottom, top, near, far);

        if (right - left >= top - bottom) {
            scale = this.w/2;
        } 
        else {
            scale = this.h/2;
        }

        // find largest square that contained the data bounding box (transformed by modelView)
        left = Math.min(left,bottom);
        right = Math.max(right,top);
        
        this.projection = matplot.ortho(left, right, left, right, near, far);

        //console.log('projection ',numeric.prettyPrint(this.projection));
        v = numeric.dot(this.modelView,databox[0]);
        //console.log('v ',v);

    }
    else {
        var aspect = 1;
        var zNear = -10;
        var zFar = 200;
        this.projection = matplot.perspective(this._CameraViewAngle * Math.PI/180, aspect, zNear, zFar);
        //console.log('projection ',numeric.prettyPrint(this.projection));
        //console.log('Target ',this._CameraTarget);
        //console.log('MV * Target',  numeric.dot(this.modelView,[this._CameraTarget[0],this._CameraTarget[1],this._CameraTarget[2],1]));
        //console.log('MV * Target',  numeric.dot(this.modelView,[this._CameraTarget[0]-this._CameraPosition[0],this._CameraTarget[1]-this._CameraPosition[1],this._CameraTarget[2]-this._CameraPosition[2],1]));

    }

    this.projectionModelView = numeric.dot(this.projection,this.modelView);

    for (var l = 0; l < 8; l++) {
        v = numeric.dot(this.projectionModelView,databox[l]);
        console.log('db v ',databox[l],v);
    }


    this.viewport = numeric.dot(
        matplot.translate([this.x+this.w/2,this.y+this.h/2,0]),
        matplot.scale([this.w/2,this.h/2,1]));

    this.viewport = matplot.prod(
        // transform relative coordinates in pixels
        matplot.scale([this.fig.canvas.width,this.fig.canvas.height,1]),
        // reverse j-axis (1-j)
        matplot.translate([0,1,0]),
        matplot.scale([1,-1,1]),
        // from [-w/2,w/2] to [x,x+w/2] 
        // (unit fraction of figure width/height)
        matplot.translate([this.x+this.w/2,this.y+this.h/2,0]),
        // from [-1,1] to [-w/2,w/2] 
        // (unit fraction of figure width/height)
        //matplot.scale([this.w/2,this.h/2,1])
        matplot.scale([scale,scale,1])
    );

    // inverse of this.viewport and this.projectionModelView

    this.invViewport = numeric.inv(this.viewport);
    this.invProjectionModelView = numeric.inv(this.projectionModelView);

    // perspective test

    var v, right = -Infinity, left = Infinity,
    top = -Infinity, bottom = Infinity,
    near = Infinity, far = -Infinity;
    
    for (var l = 0; l < 8; l++) {
        v = numeric.dot(this.projectionModelView,databox[l]);
    v[0] = v[0]/v[3];
    v[1] = v[1]/v[3];
    v[2] = v[2]/v[3];
    v[3] = v[3]/v[3];

        //console.log('v', v);
        left = Math.min(left,v[0]);
        right = Math.max(right,v[0]);
        
        top = Math.max(top,v[1]);
        bottom = Math.min(bottom,v[1]);
        
        near = Math.min(near,v[2]);
        far = Math.max(far,v[2]);
    }

    //console.log('rl', left, right, bottom, top, near, far);

    if (!is2D) {
        k = 0;
        for (j = 0; j < this.yTick.length; j++) {
            this.drawLine(this._xLim,
                      [this.yTick[j],this.yTick[j]],
                      [this.zTick[k],this.zTick[k]],
                      {linespec: this.gridLineStyle});
        }

        j = 0;
        for (k = 0; k < this.zTick.length; k++) {
            this.drawLine(this._xLim,
                      [this.yTick[j],this.yTick[j]],
                      [this.zTick[k],this.zTick[k]],
                      {linespec: this.gridLineStyle});
        }

        k = 0;
        for (i = 0; i < this.xTick.length; i++) {
            this.drawLine([this.xTick[i],this.xTick[i]],
                      this._yLim,
                      [this.zTick[k],this.zTick[k]],
                      {linespec: this.gridLineStyle});
        }

        i = 0;
        for (k = 0; k < this.zTick.length; k++) {
            this.drawLine([this.xTick[i],this.xTick[i]],
                      this._yLim,
                      [this.zTick[k],this.zTick[k]],
                      {linespec: this.gridLineStyle});
        }

        j = 0;
        for (i = 0; i < this.xTick.length; i++) {
            this.drawLine([this.xTick[i],this.xTick[i]],
                      [this.yTick[j],this.yTick[j]],
                      this._zLim,
                      {linespec: this.gridLineStyle});
        }

        i = 0;
        for (j = 0; j < this.yTick.length; j++) {
            this.drawLine([this.xTick[i],this.xTick[i]],
                      [this.yTick[j],this.yTick[j]],
                      this._zLim,
                      {linespec: this.gridLineStyle});
        }


        k = 0;
        j = 1;
        var dx, dy, dz;
        dx = dy = dz = 0.15;

        // x-axis
        this.drawLine(this._xLim,[this._yLim[j],this._yLim[j]],[this._zLim[k],this._zLim[k]]);
        for (i = 0; i < this.xTick.length; i++) {
            this.drawLine([this.xTick[i],this.xTick[i]],
                      [this._yLim[j]-dy,this._yLim[j]+dy],
                      [this.zTick[k],this.zTick[k]]);

            this.text(this.xTick[i],this._yLim[j]+3*dy,this._zLim[k],this.xTickLabel[i]);
        }


        j = k = 0;
        i = 1;
        // y-axis
        this.drawLine([this._xLim[i],this._xLim[i]],this._yLim,[this._zLim[k],this._zLim[k]]);
        for (j = 0; j < this.yTick.length; j++) {
            this.drawLine([this._xLim[i]-dx,this._xLim[i]+dx],
                      [this.yTick[j],this.yTick[j]],
                      [this.zTick[k],this.zTick[k]]);

            this.text(this._xLim[i]+4*dx,this.yTick[j],this._zLim[k],this.yTickLabel[j]);
        }

        j = 0;
        // z-axis
        this.drawLine([this._xLim[i],this._xLim[i]],[this._yLim[j],this._yLim[j]],this._zLim);
        for (k = 0; k < this.zTick.length; k++) {
            this.drawLine([this._xLim[i]-dx,this._xLim[i]+dx],
                      [this.yTick[j],this.yTick[j]],
                      [this.zTick[k],this.zTick[k]]);

            this.text(this._xLim[i]+4*dx,this.yTick[j],this.zTick[k],this.zTickLabel[k]);
        }



        //this.drawLine([this._xLim[i],this._xLim[i]],[this._yLim[j],this._yLim[j]],[this._zLim[k],this._zLim[k]]);


    }

    // define clip rectangle
    this.fig.canvas.clipRect(this.fig.canvas.width*this.x,
                             this.fig.canvas.height*this.y,
                             this.fig.canvas.width*this.w,
                             this.fig.canvas.height*this.h);

    // draw all children
    for (i = 0; i<this.children.length; i++) {
        this.children[i].draw(this);
    }

    // exit clip rectangle
    this.fig.canvas.pop()

/*    this.fig.canvas.rect(this.fig.canvas.width*this.x,
                         this.fig.canvas.height*this.y,
                         this.fig.canvas.width*this.w,
                         this.fig.canvas.height*this.h,
                             {fill: 'none', stroke: 'black'});
*/

    if (is2D) {
        this.drawXTicks();
        this.drawYTicks();
    }

    // legend
    if (this._legend) {
        this.drawLegend();
    }

    // annotation
    
    for (i = 0; i < this._annotations.length; i++) {
        var an = this._annotations[i];
        this.drawAnnotation(an.x,an.y,an.z,an.text,an.style);
    }
};

matplot.Axis.prototype.drawXTicks = function() {
    var i, y, pos, style;

    style =
        {HorizontalAlignment: 'center',
         FontSize: this.FontSize,
         color: this.color
        };

    if (this.xAxisLocation === 'bottom') {
        style.VerticalAlignment = 'top';
        style.offsetj = this.xTickLen/2;
        y = this._yLim[0];
    }
    else {
        style.VerticalAlignment = 'bottom';
        style.offsetj = -this.xTickLen/2;
        y = this._yLim[1];
    }

    for (i = 0; i < 2; i++) {
        this.drawLine([this._xLim[i],this._xLim[i]],
                      this._yLim,
                      [0,0]);
    }

    for (i = 0; i < this.xTick.length; i++) {
        pos = this.project(this.xTick[i],y);

        this.fig.canvas.line([pos[0],pos[0]],
                             [pos[1]-this.xTickLen/2,pos[1]+this.xTickLen/2],
                             {color: 'black'});

        this.text(this.xTick[i],y,0,this.xTickLabel[i],style);

        // major grid lines
        if (this.xGrid === 'on') {
            this.drawLine([this.xTick[i],this.xTick[i]],
                          this._yLim,
                          [0,0],
                          {linespec: this.gridLineStyle});
        }

    }

};

matplot.Axis.prototype.drawYTicks = function() {
    var i, x, pos, style;

    style =
        {VerticalAlignment: 'middle',
         FontSize: this.FontSize,
         color: this.color
        };

    if (this.yAxisLocation === 'left') {
        style.HorizontalAlignment = 'right';
        style.offseti = -this.yTickLen/2;
        x = this._xLim[0];
    }
    else {
        style.HorizontalAlignment = 'left';
        style.offseti = this.yTickLen/2;
        x = this._xLim[1];
    }

    for (i = 0; i < 2; i++) {
        this.drawLine(this._xLim,
                      [this._yLim[i],this._yLim[i]],
                      [0,0]);
    }

    for (i = 0; i < this.yTick.length; i++) {
        pos = this.project(x,this.yTick[i]);

        this.fig.canvas.line([pos[0]-this.yTickLen/2,pos[0]+this.yTickLen/2],
                             [pos[1],pos[1]],
                             {color: 'black'});

        this.text(x,this.yTick[i],0,this.yTickLabel[i],style);

        // major grid lines
        if (this.yGrid === 'on') {
            this.drawLine(this._xLim,
                          [this.yTick[i],this.yTick[i]],
                          [0,0],
                          {linespec: this.gridLineStyle});
        }

    }
};

matplot.Axis.prototype.legend = function(state) {
    state = (state !== undefined ? state : true);
    this._legend = state;
};

matplot.Axis.prototype.drawLegend = function() {
    var style, label, maxWidth = -Infinity, maxHeight=-Infinity, maxMarkerSize=0, bbox, x, y, n=0, i, w, h;

    for (i = 0; i<this.children.length; i++) {
        style = this.children[i].style;
        label = style.label;

        if (label !== undefined && label !== '') {
            bbox = this.fig.canvas.textBBox(label);
            maxWidth = Math.max(maxWidth,bbox.width);
            maxHeight = Math.max(maxHeight,bbox.height);

            if (style.MarkerSize !== undefined) {
                maxMarkerSize = Math.max(maxMarkerSize,style.MarkerSize);
            }

            n = n+1;
        }

    }

    var margin = 10, padding = 7, lineSpace = 1, iconWidth = 25, iconSep = 5;

    // position top right
    var legendWidth = maxWidth + 2*padding + iconWidth + iconSep + 2*maxMarkerSize, legendHeight = n*(maxHeight+lineSpace) + 2*padding;

    x = this.fig.canvas.width*(this.x+this.w) - margin - legendWidth;
    y = this.fig.canvas.height*(1-this.y-this.h) + margin;
    this.fig.canvas.rect(x,y,legendWidth,legendHeight,{fill: 'white'});

    x = x + padding;
    y = y + padding + maxHeight/2;

    for (i = 0; i<this.children.length; i++) {
        style = this.children[i].style;
        label = style.label;

        if (label !== undefined && label !== '') {
            //this.fig.canvas.line([x,x + iconWidth],[y,y],style);
            this.drawProjectedLine([x + maxMarkerSize,x + maxMarkerSize + iconWidth],
                                   [y,y],
                                   style);

            this.fig.canvas.text(x + 2*maxMarkerSize + iconWidth + iconSep,
                                 y,
                                 label,{VerticalAlignment: 'middle'});

            y = y+maxHeight+lineSpace;
        }
    }
//    this.fig.canvas.text(label);


};

matplot.Axis.prototype.rect = function(x,y,v) {
    var color, info = null;
    var ll = this.project(x[0],y[1]);
    var up = this.project(x[1],y[0]);

    if (typeof v === 'string') {
        color = v;
    }
    else {
        color = this.cmap.get(v);
        info = v.toString();
    }

    this.fig.canvas.rect(ll[0],ll[1],
                         up[0] - ll[0],up[1] - ll[1],
                         {fill: color,stroke: color,info: info});
};


matplot.Axis.prototype.text = function(x,y,z,string,style) {
    var pos;

    pos = this.project(x,y,z);
    this.fig.canvas.text(pos[0],pos[1],string,style);
};

matplot.Axis.prototype.polygon = function(x,y,z,v) {
    var pos, i = [], j = [], l, color, onclick, that = this;

    for (l = 0; l < x.length; l++) {
        pos = this.project(x[l],y[l],z[l]);
        i.push(pos[0]);
        j.push(pos[1]);
    }
    color = this.cmap.get(v);

    onclick = (function (l) {
        return function (event) {
            var n = that.annotationNDigits, text, coord;

            if (that.is2dim()) {
                coord = [x[0],y[0]];
            }
            else {
                coord = [x[0],y[0],z[0]];
            }

            coord = coord.map(function(c) { return c.toFixed(n); });
            text = v.toFixed(n) + ' at [' + coord + ']';
            that.toggleAnnotation(event,event.target,x[0],y[0],z[0],text);
        };
    }(l));

    this.fig.canvas.polygon(i,j,{fill: color,
                                 stroke: color,
                                 onclick: onclick
                                });
};

matplot.Axis.prototype.annotation = function(x,y,z,text,style) {
    this._annotations.push({x: x, y: y, z: z, text: text, style: style});
};

matplot.Axis.prototype.drawAnnotation = function(x,y,z,text,style) {
    var bbox, pos, an = {}, padding = 4, i, j, that = this, w, h;
    style = style || {};

    pos = this.project(x,y,z);
    bbox = this.fig.canvas.textBBox(text);
    i = pos[0];
    j = pos[1];
    w = bbox.width + 2*padding;
    h = bbox.height + 2*padding;

    an.rect = this.fig.canvas.rect(i,j,w,h,{fill: style.fill || '#ffc'});

    i += padding;
    j += padding;

    an.text = this.fig.canvas.text(i,j,text,
                                   {VerticalAlignment: 'top'});

    an.text.onclick = an.rect.onclick = function(event) {
        that.removeAnnotation(an);
    };

    return an;
};

matplot.Axis.prototype.removeAnnotation = function(an) {
    //return;
    this.fig.canvas.remove(an.text);
    this.fig.canvas.remove(an.rect);
};

matplot.Axis.prototype.toggleAnnotation = function(event,elem,x,y,z,text) {
    var an, i, found = -1, that = this, coord, n = this.annotationNDigits;

    if (!text) {
        if (this.is2dim()) {
            coord = [x,y];
        }
        else {
            coord = [x,y,z];
        }

        coord = coord.map(function(c) { return that.annotationFormat(c); });


        text = '[' + coord + ']';
    }


    // search for index
    for (i = 0; i < this.annotatedElements.length; i++) {
        if (this.annotatedElements[i].elem === elem) {
            found = i;
            break;
        }
    }

    if (found !== -1) {
        // is already annotated, remove annotation
        an = this.annotatedElements[found];
        this.removeAnnotation(an);
        this.annotatedElements.splice(found,1);
    }
    else {
        // create annotation
        an = this.drawAnnotation(x,y,z,text);
        an.elem = elem;
        an.text.onclick = an.rect.onclick = function(event) {
            that.toggleAnnotation(event,elem,x,y,z);
        };

        this.annotatedElements.push(an);
    }
};

matplot.Axis.prototype.drawLine = function(x,y,z,style) {
    var pos, i=[], j=[], l;
    style = style || {};

    for (l = 0; l < x.length; l++) {
        pos = this.project(x[l],y[l],z[l]);
        i.push(pos[0]);
        j.push(pos[1]);
    }

    this.drawProjectedLine(i,j,style,x,y,z);
};


matplot.Axis.prototype.drawProjectedLine = function(i,j,style,x,y,z) {
    var l, opt = {}, that = this, ms;
    style = style || {};

    this.fig.canvas.line(i,j,style);

    for (l = 0; l < i.length; l++) {
        if (x) {
            opt.data = [x[l],y[l]];
            opt['pointer-events'] = 'visible';
            opt.onclick = (function (l) {
                return function (event) {
                    that.toggleAnnotation(event,event.target,x[l],y[l],z[l]);
                };
            }(l));
        }
                //,
                                    //info: 'info:' + x[l] + ',' + y[l]
        ms = style.MarkerSize || 3;

        if (style.marker === 'o') {
            opt.fill = style.MarkerFaceColor;
            opt.stroke = style.MarkerEdgeColor || style.color;
            this.fig.canvas.circle(i[l],j[l],ms,opt);
        }
        else if (style.marker === 's') {
            opt.fill = style.MarkerFaceColor;
            //opt['fill-opacity'] = '0.00001';
            opt.stroke = style.MarkerEdgeColor || style.color;
            this.fig.canvas.rect(i[l]-ms/2,j[l]-ms/2,ms,ms,opt);
        }
    }


};




matplot.Axis.prototype.colorbar = function() {
    var cax, cmap, cLim, i, x, y,
        n = 64, tmp;

    cax = this.fig.axes(0.85,0.1,0.05,0.8);
    cax.yAxisLocation = 'right';
    cax.xTickMode = 'manual';
    cax.xTick = [];

    cLim = this.cLim();

    tmp = matplot.range(cLim[0],cLim[1],(cLim[1]-cLim[0])/(n-1));
    cmap = [tmp,tmp];

    x = [[],[]];
    y = [[],[]];
    for (i = 0; i < n; i++) {
        y[0][i] = cLim[0] + i * (cLim[1]-cLim[0])/(n-1);
        y[1][i] = y[0][i];

        x[0][i] = 0;
        x[1][i] = 1;
    }

    cax.pcolor(x,y,y);
    return cax;
};



// this class represent a figure on a screen
// should not contain SVG specific stuff

matplot.Figure = function Figure(id,width,height) {
    var that = this;
    this.container = document.getElementById(id);


    this.outerDIV =
        matplot.html('div',
                     {style: {
                         position: 'relative'}
                     }
/*,
                     [
                         this.innerDIV =
                             matplot.html('div',
                                          {style: {
                                              position: 'absolute'}
                                          },
                                          [])
                     ]
*/
);

    this.outerDIV.appendChild(
        this.contextmenu = matplot.html('div',{
            'class': 'matplot-contextmenu',
            'style': {
                'position': 'absolute',
                'display': 'none',
                'left': '0px',
                'top': '0px'}
        },
                                        [
                                            matplot.html('ul',{},[
                                                matplot.html('li',{},[
                                                    matplot.html('a',{'href': '#', 
                                                                      'onclick': function(ev) { return that.save(this); },
                                                                      'download': 'figure.svg'},
                                                                 ['Download'])]),
                                                matplot.html('li',{},[
                                                    matplot.html('a',{'href': '#', 
                                                                      'onclick': function(ev) { return that.zoom(-6,ev.pageX,ev.pageY); }}, 
                                                                 ['Zoom in'])]),
                                                matplot.html('li',{},[
                                                    matplot.html('a',{'href': '#', 
                                                                      'onclick': function(ev) { return that.zoom(6,ev.pageX,ev.pageY); }}, 
                                                                 ['Zoom out'])]),
                                                matplot.html('li',{},[
                                                    matplot.html('a',{'href': '#', 
                                                                      'onclick': function(ev) { return that.resetZoom(); }}, 
                                                                 ['Reset zoom'])])
                                            ])
                                        ]));

    this.container.appendChild(this.outerDIV);

    this.canvas = new matplot.SVGCanvas(this.outerDIV,width,height);
    this._axes = [];


    addWheelListener(this.canvas.svg, 
                     function(ev) { 
                         that.zoom(ev.deltaY,ev.pageX,ev.pageY);
                         ev.preventDefault(); 
                     }                    
                    );

    function getcoord(ev) {
        var i,j, ax;
        i = ev.pageX - that.container.offsetLeft;
        j = ev.pageY - that.container.offsetTop;
        
        ax = that._axes[0];
        var v = ax.unproject(i,j);
        //return [v[0],v[1]];
        return [i,j];
    }

    function getcoordp(ev) {
        var i,j, ax;
        i = ev.pageX - that.container.offsetLeft;
        j = ev.pageY - that.container.offsetTop;
        
        ax = that._axes[0];
        var v = ax.unproject(i,j);
        return [v[0],v[1]];
    }

    this.md = null;
    this.md2 = null;
    this.dragRect = null;
    this.dragMode = 'panning';
    this.dragMode = 'zooming';

    this.canvas.svg.addEventListener('mousedown',function(ev) {
        console.log('mousedown ',ev);

        // dismiss context menu if shown
        if (that.contextmenu.style.display === 'block') {
            that.contextmenu.style.display = 'none';
        }
        
        // check if left button is pressed
        // IE8- behaviour is different, but IE9 should be W3C conform
        // http://msdn.microsoft.com/en-us/library/ie/ff974877%28v=vs.85%29.aspx
        if (ev.button === 0) {
            that.md = ev;
            that.po = getcoordp(that.md); // origin
            var ax = that._axes[0];
            that.orig_xlim = ax.xLim();
        }
    });

    this.canvas.svg.addEventListener('mouseup',function(ev) {
        var p1, p2, ax;

        // remove zoom rectangle
        if (that.dragRect) {
            that.canvas.remove(that.dragRect);
            that.dragRect = null;
        }

        if (that.md !== null && that.md2 !== null) {
            p1 = getcoordp(that.md);
            p2 = getcoordp(that.md2);

            if (that.dragMode === 'zooming') {
                console.log('zoom ',p1,p2);
                ax = that._axes[0];
                ax.xLim([Math.min(p1[0],p2[0]),Math.max(p1[0],p2[0])]);
                ax.yLim([Math.min(p1[1],p2[1]),Math.max(p1[1],p2[1])]);
                that.draw();    
            }        
        };

        that.md = null;
        console.log('mouseup ',ev);
    });

    this.canvas.svg.addEventListener('mousemove',function(ev) {
        var p1, p2, x, y, h, w, ax;
        console.log('mousemove ',ev);


        if (that.md) {
            that.md2 = ev;
            p1 = getcoord(ev);
            p2 = getcoord(that.md);


            if (that.dragMode === 'zooming') {
                if (that.dragRect) {
                    that.canvas.remove(that.dragRect);
                    that.dragRect = null;
                }

                console.log('mousemove ',getcoord(ev),getcoord(that.md));
                x = Math.min(p1[0],p2[0]);
                w = Math.abs(p2[0]-p1[0]);
                
                y = Math.min(p1[1],p2[1]);
                h = Math.abs(p2[1]-p1[1]);

                console.log('mousemove ',x,y,w,h);
                that.dragRect = that.canvas.rect(x,y,w,h);
            }
            else {
                var lim,r;
                po = getcoordp(that.md); // origin
                p1 = getcoordp(ev);

                console.log('panning ',p1,po);
                ax = that._axes[0];
                lim = ax.xLim();
                var xs = (p1[0]-that.po[0]);
                r = [that.orig_xlim[0]-xs,that.orig_xlim[1]-xs];
                ax.xLim(r);
                that.draw();    
            }
        }
    });

    //this.outerDIV.addEventListener('contextmenu',function(ev) {
    this.canvas.svg.addEventListener('contextmenu',function(ev) {
        var i,j;
        i = ev.pageX - that.container.offsetLeft;
        j = ev.pageY - that.container.offsetTop;

        that.contextmenu.style.display = 'block';
        that.contextmenu.style.left = i + 'px';
        that.contextmenu.style.top = j + 'px';

        console.log('context ',ev)
        ev.preventDefault();
    });

};

matplot.Figure.prototype.closeContextmenu = function() {
    this.contextmenu.style.display = 'none';    
};

matplot.Figure.prototype.axes = function(x,y,w,h) {
    var ax = new matplot.Axis(this,x,y,w,h);
    this._axes.push(ax);
    return ax;
};

matplot.Figure.prototype.clear = function() {
    this.canvas.clear();
};

matplot.Figure.prototype.save = function(elem) {
    var s, xml, blob;

    s = new XMLSerializer();
    xml = s.serializeToString(this.canvas.svg);
    blob = new Blob(['<?xml version="1.0" encoding="UTF-8" standalone="no"?>' + xml],{'type': 'image/svg+xml'});
    elem.href = URL.createObjectURL(blob);
    this.closeContextmenu();
};

matplot.Figure.prototype.resetZoom = function() {
    var ax;

    ax = this._axes[0];
    ax.xLimMode('auto');
    ax.yLimMode('auto');
    this.draw();            
    this.closeContextmenu();
};

matplot.Figure.prototype.zoom = function(delta,pageX,pageY) {
    var i,j, ax;

    i = pageX - this.container.offsetLeft;
    j = pageY - this.container.offsetTop;

    ax = this._axes[0];
                         
                         
    var v = ax.unproject(i,j);
    var test = ax.project(v[0],v[1],v[2]);
    console.log('unproject ',i,j,v,test);
                         

    var alpha = (1 + Math.abs(delta)/20);

    function newrange(lim,c) {
        var xr, xc;
        
        if (delta > 0) {
            xr = alpha * (lim[1]-lim[0]);
            xc = alpha * (lim[0]+lim[1])/2 + (1-alpha) * c;
        }
        else {
            xr =  (lim[1]-lim[0]) / alpha;
            xc = ((lim[0]+lim[1])/2 - (1-alpha) * c)/alpha;
        }
        
        console.log('xr ',xr,[xc - xr/2,xc + xr/2]);
        return [xc - xr/2,xc + xr/2];
    }

    ax.xLim(newrange(ax.xLim(),v[0]));
    ax.yLim(newrange(ax.yLim(),v[1]));
    this.draw();
};

matplot.Figure.prototype.draw = function() {
    var i;
    this.clear();

    for (i = 0; i<this._axes.length; i++) {
        this._axes[i].draw();
    }
};

