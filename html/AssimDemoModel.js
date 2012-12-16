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


var fig;

function main() {
    var h = [], U = [], zeta=[], dt = 0.003, dx=0.1, n=100, g=9.81, j, omega=[], p=[], i=[];
    var nmax = 100;
    var x = {zeta: [], U: []};

    for (j=0; j<n; j++) {
        h[j] = 100;
        x.zeta[j] = 10*Math.exp(-j/10);
    }

    for (j=0; j<n+1; j++) {
        x.U[j] = 0;
    }

    id = 'canvas';
    width="700";
    height="500";
    fig = new Figure(id,width,height);

    ax = fig.axes(0.1,0.1,.72,.8);
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
    ax.colorbar();

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

