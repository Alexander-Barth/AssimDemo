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
/*global jQuery: false, $: false, numeric: false, MathJax */


var nu = numeric;
var pp = numeric.prettyPrint;

// gaussian random numbers
function randn(size) { 
    var U,V,X;

    U = nu.random(size);
    V = nu.random(size);

    X = nu.mul(nu.sqrt(nu.mul(-2,
                              nu.log(U))),
               nu.cos(nu.mul(2*Math.PI,
                             V)));

    return X;
}

function covarDecomp(P) {
    var S, B;
    B = nu.svd(P);
    S = nu.dot(B.U,nu.diag(nu.sqrt(B.S)));

    //console.log('P ',nu.prettyPrint(P));
    //console.log('S*S^T ' ,nu.prettyPrint(nu.dot(S,nu.transpose(S))));
    return S;
}


function randnCovar(P) {
    var S,Z, n = P.length;
    
    S = covarDecomp(P);
    Z = randn([n]);
    return nu.dot(S,Z);
}

function randnCovarS(S) {
    var Z, n = S.length;
    
    Z = randn([n]);
    return nu.dot(S,Z);
}


function range(start,end,step) {
    var i, r = [];
    step = step || 1;

    for (i=start; i<=end; i+=step) {
        r.push(i);
    }
    return r;
}

/*
% xn = rungekutta4(t,x,dt,f)
% solve a system of the type
% dx/dt = f(t,x)
% with runge kutta of order 4
% input: 
%   t: time (may be empty)
%   x: initial condition
%   dt: time step
% output:
%   xn: state at t+dt
*/

function rungekutta4(t,x,dt,f) {
    var k1,k2,k3,k4,xn;

    k1 = nu.mul(dt,f(t,x));
    k2 = nu.mul(dt,f(t + dt/2, nu.add(x,nu.mul(1/2,k1))));
    k3 = nu.mul(dt,f(t + dt/2, nu.add(x,nu.mul(1/2,k2))));
    k4 = nu.mul(dt,f(t +   dt, nu.add(x,nu.mul(1/2,k3))));

    xn = nu.add(x, nu.mul(1/6,k1), nu.mul(1/3,k2), nu.mul(1/3,k3), nu.mul(1/6,k4));
    return xn;
}

/*
  % [x] = conjugategradient(fun,b,tol,maxit,pc,pc2,x0);
  % [x,Q,T] = conjugategradient(fun,b,tol,maxit,pc,pc2,x0);
  %
  % solves for x
  % A x = b
  % using the preconditioned conjugated-gradient method.
  % It provides also an approximation of A:
  % A \sim Q*T*Q'
  %
  % J(x) = 1/2 (x' b - x' A x)
  % ∇ J = b - A x
  % A x = b - ∇ J
  % b = ∇ J(0)
  %
  % the columns of Q are the Lanczos vectors

  % Alexander Barth 2010,2012
*/

function conjugategradient(fun,b,options) {
    "use strict";
    var n,tol2,k,alpha,beta,delta,gamma,x,r,z,p,zr_new,zr_old,r_old,Ap,tol,maxit,pc,pc2,x0;

    tol = options.tol || 1e-6;
    maxit = options.maxit || 100;
    pc = options.pc || function(x) { return x; };
    pc2 = options.pc2 || function(x) { return x; };
    x0 = options.x0; // TODO


    n = b.length;
    tol2 = tol*tol;

    alpha = [];
    beta = [];
    delta = [];
    gamma = [];


    //M = inv(invM);
    //E = chol(M);


    // initial guess
    x = x0;

    // gradient at initial guess
    r = nu.sub(b, fun(x));

    if (nu.dot(r,r) < tol2) {
        return x;
    }
    
    // apply preconditioner
    z = pc(r);

    // first search direction == gradient
    p = z;

    // compute: r' * inv(M) * z (we will need this product at several
    // occasions)

    zr_old = nu.dot(r,z);

    // r_old: residual at previous iteration
    r_old = r;

    for (k = 1; k <= maxit; k++) {
        // compute A*p
        Ap = fun(p);
        //maxdiff(A*p,Ap)
        
        // how far do we need to go in direction p?
        // alpha is determined by linesearch
        
        // alpha z'*r / (p' * A * p)
        alpha[k] = zr_old / nu.dot(p,Ap); 

        // get new estimate of x
        x = nu.add(x, nu.mul(alpha[k],p));

        // recompute gradient at new x. Could be done by
        // r = b-fun(x);
        // but this does require an new call to fun
        r = nu.sub(r, nu.mul(alpha[k],Ap));
        
        //maxdiff(r,b-fun(x))
        
        // apply pre-conditionner
        z = pc(r);

        
        zr_new = nu.dot(r,z);

        if (nu.dot(r,r) < tol2) {
            //k,maxit,r'*r
            //k
            break;
        }
        
        //Fletcher-Reeves
        beta[k+1] = zr_new / zr_old;
        //Polak-Ribiere
        //beta(k+1) = r'*(r-r_old) / zr_old;
        //Hestenes-Stiefel
        //beta(k+1) = r'*(r-r_old) / (p'*(r-r_old));
        //beta(k+1) = r'*(r-r_old) / (r_old'*r_old);
        
        
        // norm(p)
        p = nu.add(z, nu.mul(beta[k+1],p));
        zr_old = zr_new;  
        r_old = r;
    }

    return x;
}

// x,yo and time should be empty arrays on entry
function FreeRun(xi,Pi,nmax,no,M,Mtgl,QS,H,x,P,yo,time) {
    // free run
    var obsindex = 0, n, Mn, Q;

    x[0] = xi;
    if (QS !== null) {
        P[0] = Pi;
        Q = nu.dot(QS,nu.transpose(QS));
    }
    time[0] = 0;

    //Mn = function (x) { return M(n,x); };
    Mn = function (dx) { return Mtgl(n,x[n-1],dx); };
    
    for (n = 1; n <= nmax; n++) {        
        x[n] = M(n,x[n-1]);
        if (QS !== null) {
            x[n] = nu.add(x[n],randnCovarS(QS));
            P[n] = nu.add(nu.transpose(P[n-1].map(Mn)).map(Mn),
                          Q);
        }


        time[n] = n;
        
        if (n === no[obsindex]) {
            yo[obsindex] = H(obsindex,x[n]);
            obsindex = obsindex+1;        
        }
    }
}

// yo is just a vector (not a matrix with one column)
function analysis(xf,Pf,yo,R,Hn) {
    var PH, HPH, K, xa, Pa;

    PH = Pf.map(Hn);
    HPH = nu.transpose(PH).map(Hn);

    
    K = nu.dot(PH,
               nu.inv(nu.add(HPH,
                             R)));
    
    xa = nu.add(xf,
                nu.dot(K,
                       nu.sub(yo,
                              Hn(xf))));

    Pa = nu.sub(Pf,
                nu.dot(K,
                       nu.transpose(PH)));

    return {xa: xa, Pa: Pa};
}

function KalmanFilter(xi,Pi,QS,M,Mtgl,nmax,no,yo,R,H,x,P,time,options) {
    var obsindex = 0, n, Mn, i, Hn, res, Q;
    options = options || {method: 'KF'};

    x[0] = xi;
    P[0] = Pi;
    time[0] = 0;
    // obs index
    i = 1;
    Q = nu.dot(QS,nu.transpose(QS));

    // n time index
    // i index of x with forecast and analysis

    Mn = function (dx) { return Mtgl(n,x[i-1],dx); };
    //Mn = function (dx) { return M(n,dx); };
    Hn = function (x) { return H(obsindex,x); };

    for (n = 1; n <= nmax; n++) {
        //x[i] = nu.add(Mn(x[i-1]),randnCovar(Q));
        x[i] = nu.add(M(n,x[i-1]),randnCovarS(QS));

        if (options.method === 'KF') {
            P[i] = nu.add(nu.transpose(P[i-1].map(Mn)).map(Mn),
                          Q);
        }
        else {
            P[i] = Pi;
        }

        time[i] = n;
        i = i+1;

        if (n === no[obsindex]) {
            //console.log('assim ',n);
            res = analysis(x[i-1],P[i-1],yo[obsindex],R,Hn);
            x[i] = res.xa;
            P[i] = res.Pa;
            time[i] = n;
            i = i+1;

            obsindex = obsindex+1;
        }
    }
}



function Nudging(xi,Q,M,nmax,no,yo,io,tau,x,time) {
    var obsindex = 0, n, Mn, j;

    x[0] = xi;
    time[0] = 0;

    // n time index

    Mn = function (x) { return M(n,x); };

    for (n = 1; n <= nmax; n++) {
        //console.log('n ',n);

        x[n] = nu.add(Mn(x[n-1]),randnCovar(Q));        
        time[n] = n;
        
        // loop over all observations
        for (j = 0; j < yo[obsindex].length; j += 1) {
            // nudging toward observations
            x[n][io[j]] += (yo[obsindex][j] - x[n][io[j]])/tau;
        }

        if (n === no[obsindex]) {
            //console.log('assim ',n);
            // use next observation
            obsindex = obsindex+1;
        }
    }
}

function FourDVar(xi,Pi,Q,M,Mtgl,MT,nmax,no,yo,R,H,HT,x,lambda,time,options) {
    var i, n, res, b, fun, x0, innerloops, tol, outerloops, dxa; 

    options = options || {};
    innerloops = options.innerloops || 100;
    outerloops = options.outerloops || 10;
    tol = options.tol || 1e-6;

    function gradient(dx0) {
        var dx=[], grad, obsindex;
        
        dx[0] = dx0;

        // foreward integration
        for (n = 0; n <= nmax-1; n++) {
            dx[n+1] = nu.add(Mtgl(n,x[n],dx[n]),randnCovar(Q));
        }

        // backward integration
        lambda[nmax+1] = nu.rep([xi.length],0);
        obsindex = no.length-1; // start with last obs.

        for (n = nmax; n >= 0; n--) {
            lambda[n] = MT(n,x[n],lambda[n+1]);
            
            if (n === no[obsindex]) {
                //console.log('assim ',n);
                
                lambda[n] = nu.add(
                    lambda[n],
                    HT(obsindex,nu.dot(nu.inv(R),
                                       nu.sub(yo[obsindex],
                                              H(obsindex,
                                                nu.add(x[n],dx[n]))))));
                
                obsindex = obsindex-1;
                
            }
        }

        grad = nu.add(
            nu.dot(
                nu.inv(Pi),
                nu.sub(xi,nu.add(x[0],dx0))),
            lambda[0]);

        return nu.mul(-2,grad);

    }

    var xa = xi;
    var zeros = nu.rep([xi.length],0);
    // b will have its latest value
    fun = function(x) { return nu.sub(b,gradient(x)); };

    for (i = 0; i < outerloops; i++) {
        // run with non-linear model
        x[0] = xa;
        for (n = 1; n <= nmax; n++) {
            x[n] = nu.add(M(n,x[n-1]),randnCovar(Q));
            time[n] = n;
        }
        
        // dx increment relative to xi
        b = gradient(zeros);

        dxa = conjugategradient(fun,b,{tol: tol, maxit: innerloops, x0: zeros});

        // add increment dxa to xa
        xa = nu.add(xa,dxa);
    }

    x[0] = xa;

    time[0] = 0;
    // foreward run with corrected IC
    for (n = 1; n <= nmax; n++) {
        x[n] = nu.add(M(n,x[n-1]),randnCovar(Q));
        time[n] = n;
    }
}

// analysis based on an ensemble of model states
//
// Input:
// E: initial ensemble (forecast), Matrix of size n x Nens
// H: observation operator: R^n -> R^m
// R: error covariance of observations, Matrix of size m x m
// yo: observation, vector with m elements
// inflation: scalar
//
// Output:
// Ea: analysis ensemble, matrix of size n x Nens

function EnsembleAnalysis(E,H,R,yo,inflation) {
    var n, Mn, i, Hn, res, Nens, HET, B, U, Lambda, ampl;
    inflation = inflation || 1;

    Nens = E[0].length;
    var scale = 1/Math.sqrt(Nens-1);

    // mean operator
    var M = nu.rep([Nens,Nens],1/Nens);
    var Mm = nu.rep([Nens],1/Nens);

    var I = nu.identity(Nens);
    var iR = nu.inv(R);

    // E[space index][ensemble index]

    // apply H to every ensemble member HE^T[ensemble index][obs space index]
    HET = nu.transpose(E).map(H);

    // HSf = HE (I - M) * scale

    // A = HE^T R^{-1} HE ; A[ensemble index][ensemble index]
    var A = nu.dot(nu.dot(HET,iR),nu.transpose(HET));
    // HSf = HE (I - M) * scale
    // B = (HSf)' inv(R) (HSf)
    var AM = nu.dot(A,M);
    // (A - A*M - M*A + M*A*M)*scale^2;
    B = nu.mul(nu.add(nu.sub(nu.sub(A,AM),nu.transpose(AM)),nu.dot(M,AM)),scale*scale);

    res = nu.svd(B);
    U = res.U; 
    Lambda = res.S;
    // Hxf = HE * M = (M HE^T)^T
    var Hxf = nu.dot(Mm,HET);
    var d = nu.sub(yo,Hxf);

    // tmp = (HE'*(iR * d)) * scale;
    var tmp = nu.mul(nu.dot(HET,nu.dot(iR,d)),scale);

    // tmp = tmp - mean(tmp);
    tmp = nu.sub(tmp,nu.sum(tmp)/Nens);

    // ampl = U*inv(eye(r) + Lambda)* (U' * tmp) ;

    ampl = nu.dot(U,
                  nu.dot(nu.diag(nu.div(1,nu.add(1,Lambda))),
                         nu.dot(nu.transpose(U),tmp)));

    // inc = Sf * ampl = E * (I-M) * ampl * scale;
    
    var inc = nu.dot(E,
                     nu.dot(nu.sub(I,M),
                            nu.mul(ampl,scale)));

    var xf = nu.dot(E,Mm);
    var xa = nu.add(xf,inc);

    // inc = (E * ampl - mean(E,2)*sum(ampl)) * scale;

    // A2 = (eye(r) - M) * (U * sqrt(inv(eye(r) + Lambda)) * U'  )
    // E*A2 = Sa * scale
    var A2 = nu.mul(inflation,
                    nu.dot(nu.sub(I,M),
                           nu.dot(U,
                                  nu.dot(nu.diag(nu.div(1,nu.sqrt(nu.add(1,Lambda)))),
                                         nu.transpose(U)))));

    var XA = nu.dot(nu.transpose([xa]),nu.rep([1,Nens],1));

    var Ea = nu.add(XA,
                    nu.dot(E,A2));

    return Ea;
}

function EnsembleKalmanFilter(xi,PiS,QS,M,nmax,no,yo,R,H,x,time,options) {
    var obsindex = 0, n, Mn, i, j, Hn, res, Nens, E, Ea,inflation;
    options = options || {};
    Nens = options.Nens || 100;
    inflation = options.inflation || 1;

    // obs index
    i = 0;
    // n time index
    // i index of x with forecast and analysis

    Mn = function (x) { return M(n,x); };
    Hn = function (x) { return H(obsindex,x); };


    // x[time index][ensemble index][space index]
    for (n = 0; n <= nmax; n++) {
        x[i] = [];

        if (n === 0) {
            // initialize ensemble
            for (j = 0; j < Nens; j++) {
                x[i][j] = nu.add(xi,randnCovarS(PiS));
            }
        }
        else {
            // ensemble run
            for (j = 0; j < Nens; j++) {
                x[i][j] = nu.add(Mn(x[i-1][j]),randnCovarS(QS));

            }
        }

        time[i] = n;
        i = i+1;

        if (n === no[obsindex]) {
            // analysis

            E = nu.transpose(x[i-1]);
            Ea = EnsembleAnalysis(E,Hn,R,yo[obsindex]);

            x[i] = nu.transpose(Ea);
            time[i] = n;
            i = i+1;

            obsindex = obsindex+1;
        }
    }
}

function EnsembleDiag(E,x,P) {
    var Nens, M, Mm, i;

    Nens = E[0].length;
    // mean operator
    M = nu.mul(nu.sub(nu.identity(Nens), nu.rep([Nens,Nens],1/Nens)),1/Math.sqrt(Nens-1));
    M = nu.dot(M,M);
    Mm = nu.rep([Nens],1/Nens);

    // ensemble statistics
    for (i = 0; i < E.length; i++) {
        x[i] = nu.dot(nu.transpose(E[i]),Mm);     
        P[i] = nu.dot(nu.dot(nu.transpose(E[i]),M),E[i]);
    } 
}


function test_conjugategradient(){
    var fun = function(x) { return nu.dot([[1,0.1],[0.1,1]],x); };
    var b = [1,2];

    var xa = conjugategradient(fun,b,{tol: 1e-6, maxit: 20, x0: [1,1]});

    console.log('conjugategradient',nu.sub(fun(xa),b));
}

function test_fourDVar(){

    var H,R,xi,Pi,M,no,nmax,model,model_tgl,modelT,obsoper,obsoperT,Q,yo,lambda,x,time, diff_norm;
    xi = [1,1];
    H = [[1,0]];
    R = [[1]];
    Pi = nu.identity(2);
    Q = nu.rep([2,2],0);
    M =  [[1, -0.1],[ 0.1, 1]];
    no = [1,4];
    nmax = 10;
    yo = [[3],[7]];

    model = function(n,x) { return nu.dot(M,x); };
    model_tgl = function(n,x,dx) { return nu.dot(M,dx); };
    modelT = function(n,x,dx) { return nu.dot(nu.transpose(M),dx); };
    obsoper = function(n,x) { return nu.dot(H,x); };
    obsoperT = function(n,x) { return nu.dot(nu.transpose(H),x); };

    lambda = [];
    x = [];
    time = [];

    FourDVar(xi,Pi,Q,model,model_tgl,modelT,nmax,no,yo,R,obsoper,obsoperT,x,lambda,time);
    var x0_ref = [    3.618040483830431,  -0.311337252414055]; // (matlab)

    console.log('FourDVar diff ',nu.sub(x[0],x0_ref));
    diff_norm = nu.norm2(nu.sub(x[0],x0_ref));
    console.assert(diff_norm < 1e-10,'diff versus matlab',x[0],x0_ref);


    //console.log('FourDVar ',x[x.length-1])

    var x_kf = [];
    var P = [];

    KalmanFilter(xi,Pi,Q,model,model_tgl,nmax,no,yo,R,obsoper,x_kf,P,time);

    //    console.log('KF ',x_kf[x_kf.length-1]);

    // should be ~0

    diff_norm = nu.norm2(nu.sub(x_kf[x_kf.length-1], x[x.length-1]));
    console.assert(diff_norm < 1e-10,'diff KF 4Dvar',diff_norm,x_kf[x_kf.length-1], x[x.length-1]);
}



function test_EnsembleAnalysis()  {

    var E = [[1,10],
             [2,20],
             [3,30]];

    /*var H = [[1,0,0],
      [0,2,0]];*/

    var H = function(x) { return [x[0],2*x[1]]; };
    var yo = [-1,-2];
    var R = [[1  ,0.1],
             [0.1,2]];


    var Ea = EnsembleAnalysis(E,H,R,yo);
    //console.log('Ea',Ea)

    var Ea_ref = [[ -0.769462603828705, -0.289112526075811],
                  [ -1.538925207657411, -0.578225052151622],
                  [ -2.308387811486116, -0.867337578227433]];

    console.log('Ea diff',pp(nu.sub(Ea,Ea_ref)));
    

}

