/*
% [zetas,Us] = shallow_water1d(zeta,U,dx,dt,n,h,omega,p,save_index,doplot);
%
% 1D shallow water toy model
% Not to be used for any serious work!
%
% Input:
%   zeta, U: surface elevation and transport inital condition
%   dx: grid resolution
%   dt: time step
%   n: number of grid points for U
%   omega: angular tidal frequency
%   p: tidal parameters at boundary
%   save_index: which time index to save
%   do_plot: show plot (1) or not (0)
%
% Output:
%   zetas,Us: surface elevation ans transport at saved time steps
%
*/


colormaps = {'jet':
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

function shallow_water1d(zeta,U,dx,dt,n,h,omega,p,save_index,doplot,zetas,Us) {
    var x,h_u = [],dt,g,max_dt,j;

    x = nu.mul(dx,range(0,n));

    h_u[0] = 0; // not used
    for (j=1; j<n; j++) {
        h_u[j] = (h[j-1] + h[j])/2;
    }
    h_u[n] = 0; // not used

    dt = 0.0020;
    g = 9.81;

    //max_dt = dx/Math.sqrt(g*Math.max(h));

    zetas = [];
    Us = [];

    j = 0;

    for (i=1; i<100; i++) {
        t = dt*i;
        //zeta(1) = p(1)*cos(omega*t) + p(2)*sin(omega*t);
        //zeta(end) = p(3)*cos(omega*t) + p(4)*sin(omega*t);

        // Arakawa C
        // U[0] zeta[0] U[1] zeta[1] ...
        //  |     +      |     +      |

        for (j=0; j<n; j++) {        
            zeta[j] = zeta[j] - dt * (U[j+1] - U[j])/dx;
        }

        for (j=1; j<n; j++) {        
            U[j] = U[j] - dt * g * h_u[j] * (zeta[j]-zeta[j-1])/dx ;
        }

        doplot(i,zeta,U);
    }
}


function ModelShallowWater1d(dx,dt,n,h) {
    var j;

    this.x = nu.mul(dx,range(0,n));
    this.h_u = [];

    this.h_u[0] = 0; // not used
    for (j=1; j<n; j++) {
        this.h_u[j] = (h[j-1] + h[j])/2;
    }
    this.h_u[n] = 0; // not used

    this.g = 9.81;
    this.dx = dx;
    this.dt = dt;
    this.n = n;
    this.h = h;

}

ModelShallowWater1d.prototype.step = function (n,x) {
    var j;
    var xn = {zeta: [], U: []};
    
    // boundary conditions
    xn.U[0] = 0;
    xn.U[this.n] = 0;

    // volumne conservation    
    for (j=0; j<this.n; j++) {        
        xn.zeta[j] = x.zeta[j] - this.dt * (x.U[j+1] - x.U[j])/this.dx;
    }

    // momentum conservation
    for (j=1; j<this.n; j++) {        
        xn.U[j] = x.U[j] - this.dt * this.g * this.h_u[j] * (xn.zeta[j]-xn.zeta[j-1])/this.dx ;
    }

    return xn;
}



function Surface(x,y,z,c) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.c = c;
}

Surface.prototype.lim = function(what) {
    var min, max, tmp = this[what];
    min = max = tmp[0][0];

    for (i=0; i<tmp.length; i++) {
        for (j=0; j<tmp[0].length; j++) {
            min = Math.min(min,tmp[i][j]);
            max = Math.max(max,tmp[i][j]);
        }
    }    
    return [min,max];
};

Surface.prototype.draw = function(fig) {
    var i,j;

    for (i=0; i<this.x.length-1; i++) {
        for (j=0; j<this.x[0].length-1; j++) {
            // does not work for curvilinear grid
            fig.rect([this.x[i][j],this.x[i+1][j]],
                     [this.y[i][j],this.y[i+1][j+1]],
                     this.c[i][j]);
            
        }
    }
}


function ColorMap(clim,type) {
    this.clim = clim;
    this.type = type || 'jet';
    this.cm = colormaps[this.type];
}

ColorMap.prototype.get = function (v) {
    var c=[];
    var vs = (v-this.clim[0])/(this.clim[1]-this.clim[0]);
    c[0] = vs;
    c[1] = 1;
    c[2] = 1;
    
    var index = Math.round(vs * this.cm.length);
    index = Math.max(Math.min(index,this.cm.length-1),0);
    c = this.cm[index];

    return 'rgb(' + Math.round(255*c[0]) + ',' +  + Math.round(255*c[1]) + ',' +  + Math.round(255*c[2]) + ')';
};

// this class represent a figure on a screen
// should not contain SVG specific stuff

function Figure(id,width,height) {
    this.canvas = new SVGCanvas(id,width,height);
    this.xlim = [0,100];
    this.ylim = [0,100];
    this._axes = [];
}

Figure.prototype.axes = function(x,y,w,h) {
    var ax = new Axis(this,x,y,w,h)
    this._axes.push(ax);
    return ax;
};

Figure.prototype.draw = function() {
    var i;

    for (i = 0; i<this._axes.length; i++) {
        this._axes[i].draw();
    };
};

// Axis(fig,x,y,w,h) 
// create a new axes in figure fig
// at location x,y and width w and height h
// x,y,w,h are fraction of the total figure height and width

function Axis(fig,x,y,w,h) {
    this.fig = fig;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.cmap = new ColorMap([-1,1]);

    this.children = [];

}

Axis.prototype.project = function(x,y) {
    // i,j in axis coordinate space
    var i = this.x + (x-this.xlim[0])/(this.xlim[1]-this.xlim[0]) * this.w;
    var j = this.y + (y-this.ylim[0])/(this.ylim[1]-this.ylim[0]) * this.h;

    // i,j in figure space
    var i = i * this.fig.canvas.width;
    var j = j * this.fig.canvas.height;

    return {i:i,j:j};

};

Axis.prototype.lim = function(what) {
    var i, min = +Infinity, max = -Infinity;

    if (this.children.length > 0) {
        for (i = 0; i<this.children.length; i++) {
            range = this.children[i].lim(what);
            min = Math.min(min,range[0]);
            max = Math.max(max,range[1]);
        };
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

Axis.prototype.pcolor = function(x,y,v) {
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

    this.children.push(new Surface(x,y,[],v));
};

Axis.prototype.draw = function() {
    var i;

    this.xlim = this.lim('x');
    this.ylim = this.lim('y');
    this.cmap.clim = this.lim('c');

    this.rect(this.xlim,this.ylim,'black');

    for (i = 0; i<this.children.length; i++) {
        this.children[i].draw(this);
    };
};

Axis.prototype.rect = function(x,y,v) {
    var color;
    var ll = this.project(x[0],y[0]);
    var up = this.project(x[1],y[1]);

    if (typeof v === 'string') {
        color = v;
    }
    else {
        color = this.cmap.get(v);
    }

    this.fig.canvas.rect(ll.i,ll.j,
                     up.i - ll.i,up.j - ll.j,
                     color);
}

function mk(tag,attribs,children) {
    attribs = attribs || {}; 
    children = children || [];
    xmlns = "http://www.w3.org/2000/svg";

    var elem = document.createElementNS(xmlns, tag);

    for (var a in attribs) {
        elem.setAttributeNS(null, a, attribs[a]);
    }

    for (var c in children) {
        elem.appendChild(children[c]);
    }
    return elem;
}

function SVGCanvas(id,width,height) {
    this.xmlns = "http://www.w3.org/2000/svg";
    this.id = id;
    this.width = width;
    this.height = height;

    this.container = document.getElementById(id);
    this.container.appendChild(
        this.svg = mk('svg',{width: width, height: height, 'style': 'border: 1px solid black'},
           [this.axis = mk('g')]));              
};

SVGCanvas.prototype.rect = function(x,y,width,height,color) {
    this.axis.appendChild(
        mk('rect',{x: x, y: y, width: width, height: height, fill: color, 'stroke': color}));
}


var fig;

function main() {
    var h = [], U = [], zeta=[], dt = 0.003, dx=0.1, n=100, g=9.81, j, omega=[], p=[], i=[];
    var nmax = 200;
    var x = {zeta: [], U: []};

    for (j=0; j<n; j++) {
        h[j] = 100;
        x.zeta[j] = 10*Math.exp(-j/10);
    }

    for (j=0; j<n+1; j++) {
        x.U[j] = 0;
    }

    id = 'canvas';
    width="500";
    height="500";
    fig = new Figure(id,width,height);

    ax = fig.axes(0.1,0.1,.6,.8);
    ax.cmap = new ColorMap([0,5],'jet');



    var data = []; datax=[],datat = [],zeta=[];

    var model = new ModelShallowWater1d(dx,dt,n,h);
    for (i=0; i<nmax; i++) {
        x = model.step(i,x);
        //console.log(x.zeta[n-1],x.U[n]);

        datax[i]= [];
        datat[i]= [];
        zeta[i]= [];

        for (j=0; j<n; j++) {
            datax[i][j] = i;
            datat[i][j] = j;
            zeta[i][j] = x.zeta[j];
        }

    }

    ax.pcolor(datax,datat,zeta);

    cax = fig.axes(0.75,0.1,.1,.8);
    var cmap = [range(0,63),range(0,63)];
    cax.cmap = new ColorMap([0,63],'jet');
    cax.pcolor(cmap);

    fig.draw();
}        




/*
    $('#myGroup').append(
        $('<rect xmlns="http://www.w3.org/2000/svg"><rect/>').attr({'width': 10, 'height': 10,'x': 20, 'y':20, 'fill': 'green'}));

*/
/*
$(document).ready(function() {

});*/

//document.getElementsByTagName('body')[0].onload = main;

