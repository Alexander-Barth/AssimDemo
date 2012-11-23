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


function range(start,end,step) {
    var i, r = [];
    step = step || 1;

    for (i=start; i<=end; i+=step) {
        r.push(i);
    }
    return r;
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
    var n,tol2,k,alpha,beta,delta,gamma,x,r,z,p,zr_new,zr_old,r_old,Ap,r,tol,maxit,pc,pc2,x0;

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
	    break    
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
function FreeRun(xi,Pi,nmax,no,M,Q,H,x,P,yo,time) {
    // free run
    var obsindex = 0, n, Mn;

    x[0] = xi;
    if (Q !== null) {
        P[0] = Pi;
    }
    time[0] = 0;

    Mn = function (x) { return M(n,x); };
    
    for (n = 1; n <= nmax; n++) {        
        x[n] = Mn(x[n-1]);
        if (Q !== null) {
            x[n] = nu.add(x[n],randnCovar(Q));
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

function KalmanFilter(xi,Pi,Q,M,nmax,no,yo,R,H,x,P,time,options) {
    var obsindex = 0, n, Mn, i, Hn, res;
    options = options || {method: 'KF'};

    x[0] = xi;
    P[0] = Pi;
    time[0] = 0;
    // obs index
    i = 1;
    // n time index
    // i index of x with forecast and analysis

    Mn = function (x) { return M(n,x); };
    Hn = function (x) { return H(obsindex,x); };

    for (n = 1; n <= nmax; n++) {
        x[i] = nu.add(Mn(x[i-1]),randnCovar(Q));

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

function FourDVar(xi,Pi,Q,M,MT,nmax,no,yo,R,H,HT,x,lambda,time) {
    var n, res, b, fun, x0;

    function gradient(x0) {
	var x=[], grad, obsindex;
    
	x[0] = x0;

	// foreward integration
	for (n = 0; n <= nmax-1; n++) {
            x[n+1] = nu.add(M(n,x[n]),randnCovar(Q));
	}

	// backward integration
	lambda[nmax+1] = nu.rep([xi.length],0);
	obsindex = no.length-1; // start with last obs.

	for (n = nmax; n >= 0; n--) {
	    lambda[n] = MT(n,lambda[n+1]);
	    
            if (n === no[obsindex]) {
            //console.log('assim ',n);
	    
		lambda[n] = nu.add(
		    lambda[n],
		    HT(obsindex,nu.dot(nu.inv(R),
				       nu.sub(yo[obsindex],
					      H(obsindex,x[n])))));
		
		obsindex = obsindex-1;
		
	    }
	}

	grad = nu.add(
	         nu.dot(
		   nu.inv(Pi),
		   nu.sub(xi,x0)),
	         lambda[0]);

	return nu.mul(-2,grad);

    }

    b = gradient(nu.rep([xi.length],0));
    fun = function(x) { return nu.sub(b,gradient(x)); };

    x[0] = conjugategradient(fun,b,{tol: 1e-6, maxit: 20, x0: xi});
    time[0] = 0;

    // foreward run with corrected IC
    for (n = 1; n <= nmax; n++) {
        x[n] = nu.add(M(n,x[n-1]),randnCovar(Q));
	time[n] = n;
    }
}


function test_conjugategradient(){
var fun = function(x) { return nu.dot([[1,0.1],[0.1,1]],x); };
var b = [1,2];

var xa = conjugategradient(fun,b,{tol: 1e-6, maxit: 20, x0: [1,1]});

console.log('conjugategradient',nu.sub(fun(xa),b))
}

function test_fourDVar(){

var H,R,xi,Pi,M,no,nmax,model,modelT,obsoper,obsoperT,Q,yo,lambda,x,time;
xi = [1,1];
H = [[1,0]];
R = [[1]];
Pi = nu.identity(2);
Q = nu.rep([2,2],0);
M =  [[1, -.1],[ 0.1, 1]];
no = [1,4];
nmax = 10;
yo = [[3],[7]];

model = function(n,x) { return nu.dot(M,x); };
modelT = function(n,x) { return nu.dot(nu.transpose(M),x); };
obsoper = function(n,x) { return nu.dot(H,x); };
obsoperT = function(n,x) { return nu.dot(nu.transpose(H),x); };

lambda = [];
x = [];
time = [];

FourDVar(xi,Pi,Q,model,modelT,nmax,no,yo,R,obsoper,obsoperT,x,lambda,time);
//    3.618040483830431  -0.311337252414055 (matlab)
console.log('FourDVar ',x[0])
console.log('FourDVar ',x[x.length-1])

var x_kf = [];
var P = [];

KalmanFilter(xi,Pi,Q,model,nmax,no,yo,R,obsoper,x_kf,P,time);

    console.log('KF ',x_kf[x_kf.length-1]);

// should be ~0
    console.log('diff KF 4Dvar ',nu.sub(x_kf[x_kf.length-1], x[x.length-1]));
}