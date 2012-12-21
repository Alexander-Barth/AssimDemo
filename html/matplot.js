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

/*jslint browse: true, continue : true, devel : true, indent : 4, maxerr : 50, newcap : false, nomen : true, plusplus : false, regexp : true, sloppy : true, vars : true, white : false */
/*global jQuery: false, $: false, numeric: false, MathJax, range */


var matplot = {};

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
            - 1/3*Math.exp(-(x+1)*(x+1) - y*y); }

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

function range(start,end,step) {
    var i, r = [];
    step = step || 1;

    for (i=start; i<=end; i+=step) {
        r.push(i);
    }
    return r;
}

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


matplot.mk = function mk(tag,attribs,children) {
    var xmlns, elem, child, a, c;

    attribs = attribs || {}; 
    children = children || [];
    xmlns = "http://www.w3.org/2000/svg";
    
    elem = document.createElementNS(xmlns, tag);

    for (a in attribs) {
        if (attribs.hasOwnProperty(a)) {
            elem.setAttributeNS(null, a, attribs[a]);
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

matplot.SVGCanvas = function SVGCanvas(id,width,height) {
    this.xmlns = "http://www.w3.org/2000/svg";
    this.id = id;
    this.width = width;
    this.height = height;

    this.container = document.getElementById(id);
    this.container.appendChild(
        this.svg = matplot.mk('svg',{width: width, height: height, 'style': 'border: 1px solid black'},
           [this.axis = matplot.mk('g')]));              
};

matplot.SVGCanvas.prototype.rect = function(x,y,width,height,fill,stroke,info) {
    var rect, attrib;
    stroke = stroke || fill;
    info = info || '';

    attrib = {x: x, y: y, width: width, height: height, fill: fill, 
              'stroke': stroke};

    if (info) {
        attrib.title = info;
    }
    
    this.axis.appendChild(
        rect = matplot.mk('rect',attrib));

    if (info) {
        rect.onclick = function() { console.log('x',info); };
    }
};


matplot.SVGCanvas.prototype.polygon = function(x,y,style) {
    var polygon, points = '', i, attrib, s = 'fill:' + style.fill + ';stroke:' + style.stroke;

    //s = 'fill:' + style.fill + ';stroke:' + 'black';

    for (i = 0; i < x.length; i++) {
        points += x[i] + ',' + y[i] + ' ';
    }
    
    attrib = {points: points, style: s};

    this.axis.appendChild(
        polygon = matplot.mk('polygon',attrib));

};

matplot.SVGCanvas.prototype.text = function(x,y,text,FontFamily,FontSize,fill,HorizontalAlignment,VerticalAlignment) {

    var TextAnchor, dy = 0;
    
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
    }
    else if (VerticalAlignment === 'middle') {
        dy = FontSize/2;
    }

    this.axis.appendChild(
        matplot.mk('text',{'x': x,
                   'y': y,
                   'font-family': FontFamily,
                   'font-size': FontSize,
                   'text-anchor': TextAnchor,
                   'dy': dy,
                   'fill': fill},
           [text] ));
};

matplot.SVGCanvas.prototype.line = function(x,y,color) {
    var strokeWidth = 1;
    var style="stroke:" + color + ";stroke-width:" + strokeWidth;

    this.axis.appendChild(
        matplot.mk('line',{'x1': x[0],
                   'x2': x[1],
                   'y1': y[0],
                   'y2': y[1],
                   'style': style}));
};





matplot.Surface = function Surface(x,y,z,c) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.c = c;
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


matplot.ColorMap = function ColorMap(clim,type) {
    this.clim = clim;
    this.type = type || 'jet';
    this.cm = matplot.colormaps[this.type];
};

matplot.ColorMap.prototype.get = function (v) {
    var c=[];
    var vs = (v-this.clim[0])/(this.clim[1]-this.clim[0]);
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
    this._projection = 'perspective';

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

    this._cLim = [];
    this._cLimMode = 'auto';
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
    }
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
    }
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


// http://publib.boulder.ibm.com/infocenter/pseries/v5r3/index.jsp?topic=/com.ibm.aix.opengl/doc/openglrf/gluLookAt.htm
/*
Let E be the 3d column vector (eyeX, eyeY, eyeZ).
Let C be the 3d column vector (centerX, centerY, centerZ).
Let U be the 3d column vector (upX, upY, upZ).

*/

function cross(a,b) {
    var c = [];
    c[0] = a[1] * b[2] - a[2] * b[1];
    c[1] = a[2] * b[0] - a[0] * b[2];
    c[2] = a[0] * b[1] - a[1] * b[0];
    return c;
}

// http://publib.boulder.ibm.com/infocenter/pseries/v5r3/index.jsp?topic=/com.ibm.aix.opengl/doc/openglrf/gluProject.htm

function Perspective(fovy, aspect, zNear, zFar) {
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


    return [[ f/aspect,    0,               0,                 0],
            [        0,    f,               0,                 0],
            [        0,    0,  (zFar+zNear)/z,  (2*zFar*zNear)/z],
            [        0,    0,              -1,                 0]];


}

matplot.Axis.prototype.LookAt = function(E,C,U) {
    var L, S, Up, M;
/*
Compute L = C - E.
Normalize L.
Compute S = L x U.
Normalize S.
Compute U' = S x L.
*/
    var nu = numeric;
    L = nu.sub(C,E);
    L = nu.mul(1/nu.norm2(L),L);
    S = cross(L,U);
    S = nu.mul(1/nu.norm2(S),S);
    Up = cross(S,L);

// M is the matrix whose columns are, in order:
// (S, 0), (U', 0), (-L, 0), (-E, 1)  (all column vectors)
    
    M = [[S[0], Up[0], -L[0], -E[0]],
         [S[1], Up[1], -L[1], -E[1]],
         [S[2], Up[2], -L[2], -E[2]],
         [   0,     0,     0,    -1]];

    return M;
};

matplot.Axis.prototype.project = function(x,y,z) {
    var i,j;

    if (this._projection === 'orthographic') {
        // i,j in axis coordinate space
        i = this.x + (x-this.xlim[0])/(this.xlim[1]-this.xlim[0]) * this.w;
        j = this.y + (y-this.ylim[0])/(this.ylim[1]-this.ylim[0]) * this.h;

    }
    else {
        var CameraPosition, CameraTarget, CameraUpVector, CameraViewAngle, M, b;
        CameraPosition = [-36.5257, -47.6012, 86.6025];
	CameraTarget = [0, 0, 0];
	CameraUpVector = [0, 0, 1];
	CameraViewAngle = [10.3396];
        var fovy  = Math.PI/20;
        var aspect = 1.;
        var zNear = -5;
        var zFar = 10;

        var modelView = this.LookAt(CameraPosition,CameraTarget,CameraUpVector);
        var projection = Perspective(fovy, aspect, zNear, zFar);
        M = numeric.dot(projection,modelView);

        var b = numeric.dot(M,[x,y,z,0]);
        i = b[0]/200+.3;
        j = b[1]/200+.4;
    }

    // i,j in figure space (pixels)
    i = i * this.fig.canvas.width;
    j = j * this.fig.canvas.height;

    // reverse j axis
    j = this.fig.canvas.height-j;

    return {i:i,j:j};

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

    if (min === max) {
        min = min-1;
        max = max+1;
    }

    return [min,max];
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

matplot.Axis.prototype.draw = function() {
    var i;

    this.xlim = this.xLim();
    this.ylim = this.yLim();
    this.cmap.clim = this.cLim();

    for (i = 0; i<this.children.length; i++) {
        this.children[i].draw(this);
    }

    this.fig.canvas.rect(this.fig.canvas.width*this.x,
                         this.fig.canvas.height*this.y,
                         this.fig.canvas.width*this.w,
                         this.fig.canvas.height*this.h,
                         'none','black');

    this.drawXTicks();
    this.drawYTicks();
};

matplot.Axis.prototype.drawXTicks = function() {
    var i, y, pos, VerticalAlignment, offset;

    if (this.xTickMode === 'auto') {
        this.xTick = matplot.ticks(this.xlim[0],this.xlim[1],5);
    }

    if (this.xTickLabelMode === 'auto') {
        this.xTickLabel = this.xTick.map(function(x) {return x.toString();});
    }

    if (this.xAxisLocation === 'bottom') {
        VerticalAlignment = 'top';
        offset = this.xTickLen/2;        
        y = this.ylim[0];
    }
    else {
        VerticalAlignment = 'bottom';
        offset = -this.xTickLen/2;        
        y = this.ylim[1];
    }

    for (i = 0; i < this.xTick.length; i++) {
        pos = this.project(this.xTick[i],y);

        this.fig.canvas.line([pos.i,pos.i],
                             [pos.j-this.xTickLen/2,pos.j+this.xTickLen/2],
                             'black');
        this.fig.canvas.text(pos.i,pos.j+offset,
                             this.xTickLabel[i],this.FontFamily,
                             this.FontSize,this.color,
                             'center',VerticalAlignment
                            );
    }

};

matplot.Axis.prototype.drawYTicks = function() {
    var i, x, pos, HorizontalAlignment, offset;

    if (this.yTickMode === 'auto') {
        this.yTick = matplot.ticks(this.ylim[0],this.ylim[1],5);
    }

    if (this.yTickLabelMode === 'auto') {
        this.yTickLabel = this.yTick.map(function(y) {return y.toString();});
    }

    if (this.yAxisLocation === 'left') {
        HorizontalAlignment = 'right';
        offset = -this.yTickLen/2;        
        x = this.xlim[0];
    }
    else {
        HorizontalAlignment = 'left';
        offset = this.yTickLen/2;        
        x = this.xlim[1];
    }

    for (i = 0; i < this.yTick.length; i++) {
        pos = this.project(x,this.yTick[i]);

        this.fig.canvas.line([pos.i-this.yTickLen/2,pos.i+this.yTickLen/2],
                             [pos.j,pos.j],
                             'black');

        this.fig.canvas.text(pos.i+offset,pos.j,
                             this.yTickLabel[i],this.FontFamily,
                             this.FontSize,this.color,
                             HorizontalAlignment,'middle'
                            );
    }

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

    this.fig.canvas.rect(ll.i,ll.j,
                         up.i - ll.i,up.j - ll.j,
                         color,color,info);
};


matplot.Axis.prototype.polygon = function(x,y,z,v) {
    var p, i=[], j=[], l, color;

    for (l = 0; l < x.length; l++) {
        p = this.project(x[l],y[l],z[l]);
        i.push(p.i);
        j.push(p.j);
    }
    color = this.cmap.get(v);

    this.fig.canvas.polygon(i,j,{fill: color, stroke: color});
};

matplot.Axis.prototype.colorbar = function() {
    var cax, cmap, clim, i, x, y,
        n = 64, tmp;

    cax = this.fig.axes(0.85,0.1,0.05,0.8);
    cax.yAxisLocation = 'right';
    cax.xTickMode = 'manual';
    cax.xTick = [];

    clim = this.cLim();

    tmp = range(clim[0],clim[1],(clim[1]-clim[0])/(n-1));
    cmap = [tmp,tmp];

    x = [[],[]];
    y = [[],[]];
    for (i = 0; i < n; i++) {
        y[0][i] = clim[0] + i * (clim[1]-clim[0])/(n-1);
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
    this.canvas = new matplot.SVGCanvas(id,width,height);
    this.xlim = [0,100];
    this.ylim = [0,100];
    this._axes = [];
};

matplot.Figure.prototype.axes = function(x,y,w,h) {
    var ax = new matplot.Axis(this,x,y,w,h);
    this._axes.push(ax);
    return ax;
};

matplot.Figure.prototype.draw = function() {
    var i;

    for (i = 0; i<this._axes.length; i++) {
        this._axes[i].draw();
    }
};

