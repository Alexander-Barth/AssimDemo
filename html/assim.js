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