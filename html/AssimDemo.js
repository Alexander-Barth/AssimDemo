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

"use strict";

var nu = numeric;
var pp = numeric.prettyPrint;
var demo;

/**
 * Copyright (c) Mozilla Foundation http://www.mozilla.org/
 * This code is available under the terms of the MIT License
 */
if (!Array.prototype.map) {
    Array.prototype.map = function(fun /*, thisp*/) {
        var len = this.length >>> 0;
        if (typeof fun != "function") {
            throw new TypeError();
        }

        var res = new Array(len);
        var thisp = arguments[1];
        for (var i = 0; i < len; i++) {
            if (i in this) {
                res[i] = fun.call(thisp, this[i], i, this);
            }
        }

        return res;
    };
}

if (!Array.prototype.filter)
{
  Array.prototype.filter = function(fun /*, thisp */)
  {
    "use strict";
 
    if (this == null)
      throw new TypeError();
 
    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun != "function")
      throw new TypeError();
 
    var res = [];
    var thisp = arguments[1];
    for (var i = 0; i < len; i++)
    {
      if (i in t)
      {
        var val = t[i]; // in case fun mutates this
        if (fun.call(thisp, val, i, t))
          res.push(val);
      }
    }
 
    return res;
  };
}

function str2mat(str) {
    var rows = str.split(/ *; */);
    return rows.map(function (r)  { return r.split(/ *, */).map(parseFloat); });

}
function mat2str(A) {
    //return A.map(function (c) { return c.toString() }).join('; ');
    return A.map(function (c) { return c.join(', '); }).join(';  ');
}

function MatInput(size,id) {
    var i,j, $row;
    this.size = size;
    this.id = id;
    this.$elem = [];
    
    var $tbody;

    // create table for matrix
    $('#' + id).empty();
    $('#' + id).append($('<table/>').attr({'class': 'matrix'}).
		       append($tbody = $('<tobdy/>')));


    if (this.size.length === 1) {
	$row = $('<tr/>');

	for (i = 0; i<size[0]; i++) {
	    this.$elem[i] = $('<input/>').attr({'type':'text','size': '1','class': 'matrix_element'});

	    $row.append($('<td/>').
			append(this.$elem[i]));
	}
	    
	$tbody.append($row);
    }
    else {
	for (i = 0; i<size[0]; i++) {
	    this.$elem[i] = [];
	    $row = $('<tr/>');
	    for (j = 0; j<size[1]; j++) {
		this.$elem[i][j] = $('<input/>').attr({'type':'text','size': '1','class': 'matrix_element'});

		$row.append($('<td/>').
			    append(this.$elem[i][j]));
	    }
	    
	    $tbody.append($row);
	}
    }
}

MatInput.prototype.val = function(data) {
    var i,j;

    if (this.size.length === 1) {
	if (data) {
	    // fill-in
	    for (i = 0; i<this.size[0]; i++) {
		this.$elem[i].val(data[i]);
	    }
	}
	else {
	    // get value
	    data = [];
	    
	    for (i = 0; i<this.size[0]; i++) {
		data[i] = parseFloat(this.$elem[i].val());
	    }
	}
	return data;
    }

    else {
	if (data) {
	    // fill-in
	    for (i = 0; i<this.size[0]; i++) {
		for (j = 0; j<this.size[1]; j++) {
		    this.$elem[i][j].val(data[i][j]);
		}
	    }
	}
	else {
	    // get value
	    data = [];
	    
	    for (i = 0; i<this.size[0]; i++) {
		data[i] = [];

		for (j = 0; j<this.size[1]; j++) {
		    data[i][j] = parseFloat(this.$elem[i][j].val());
		}
	    }
	    return data;
	}
    }
};


function AssimDemo() {
    var m, that = this;

    this.models = [
	{'title': 'Identity matrix',
	 'name': 'idmat',
	 'fun': function(t,x) {
	     return x;
	 },
	 'n': 2,
	 'xit': [1,1],
	 'Pi': nu.identity(2),
	 'Q': nu.rep([2,2],0),
	 'formula': '\\mathbf x^{(n+1)} = \\mathbf x^{(n)}'},


	{'title': '1D advection in periodic domain',
	 'name': 'advection',
	 'fun': function(t,x) {
	     return nu.dot([[0,1,0,0],[0,0,1,0],[0,0,0,1],[1,0,0,0]],x);
	 },
	 'n': 4,
	 'xit': [1.5,2,3,4],
	 'Pi': nu.identity(4),
	 'Q': nu.rep([4,4],0),
	 'formula': '\
\\begin{equation}     \
\\mathbf x^{(n+1)} =  \
\\left(               \
\\begin{array}{cccc}  \
0 & 1 & 0 & 0 \\\\    \
0 & 0 & 1 & 0 \\\\    \
0 & 0 & 0 & 1 \\\\    \
1 & 0 & 0 & 0         \
\\end{array}          \
\\right)              \
\\mathbf x^{(n)}      \
\\end{equation}       \
'},

	{'title': 'oscillation',
	 'name': 'oscillation',
	 'fun': function() {	     
	     var f=1, Dt = 0.5, L = [[0,-f],[f,0]];
	     var M = nu.dot(nu.inv(nu.add(nu.identity(2),nu.mul(-Dt/2,L))),
			    nu.add(nu.identity(2),nu.mul(Dt/2,L)));
				   
	     return function(t,x) { return nu.dot(M,x) };
	 }(),
	 'n': 2,
	 'xit': [1,0],
	 'Pi': nu.identity(2),
	 'Q': nu.rep([2,2],0),
	 'formula': '\\begin{eqnarray} \
\\frac{dx_1}{dt}  &=& f x_2 \\\\ \
\\frac{dx_2}{dt}  &=& -f x_1 \
\\end{eqnarray}'}

];   


    for (m in this.models)  {
	$('#model').append($('<option />').attr({'value': this.models[m].name}).html(this.models[m].title));
    }

    // default model
    //$('#model').val('advection');
    //$('#model').val('oscillation');

    this.updateModel();

    $('#model').change(function() {
	that.updateModel();
    });

    $('.plot_param').find('input, select').change(function() {
	that.plot();
    });


    $('form').submit(function(e) {
	that.run();
	e.preventDefault();
    });

    $('#reset').click(function() {
	that.resetModel();
    });

}

AssimDemo.prototype.updateModel = function() {
    var m = this.selectedModel(), i;
    //console.log(m.title);
    $('#statevector_size').html(m.n);

    $('#model_eqn').empty();
    $('#model_eqn').append(
	$('<script type="math/tex; mode=display">').html(m.formula));
    MathJax.Hub.Typeset();

    this.Pi = new MatInput([m.n,m.n],'covar_Pi');
    this.Q = new MatInput([m.n,m.n],'covar_Q');
    this.xit = new MatInput([m.n],'statevector_xi');

    this.resetModel();
};

AssimDemo.prototype.resetModel = function() {
    var m = this.selectedModel(), i;
    //$('#covar_Pi').val(mat2str(m.Pi));
    //$('#covar_Q').val(mat2str(m.Q));
    
    this.Pi.val(m.Pi);
    this.Q.val(m.Q);
    this.xit.val(m.xit);

    $('#nmax').val(40);
    $('#obs_xsteps').val(2);
    $('#obs_tsteps').val(5);
    $('#obs_var').val(.2);
    $('#randseed').val(3);

    $('#statevector_index').empty();
    $('#covar_index_i').empty();
    $('#covar_index_j').empty();

    for (i=0; i<m.n; i++)  {
	$('#statevector_index').append($('<option />').attr({'value': i}).html(i+1));
	$('#covar_index_i').append($('<option />').attr({'value': i}).html(i+1));
	$('#covar_index_j').append($('<option />').attr({'value': i}).html(i+1));
    }
};
AssimDemo.prototype.selectedModel = function() {
    return this.models.filter(function (m)  { return m.name === $('#model').val(); })[0];
};

function integrate(model,x,t0,t1) {
    var n,res = [];
    var dt = 0.1, time = [];
    
    res[0] = x;
    time[0] = t0;
    n = 0;
    
    while (time[n] < t1) {
	res[n+1] = model(time[n],dt,res[n]);	
	time[n+1] = time[n] + dt;
	n = n+1;
    }
    
    return {result: res, time: time};
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
    
    for (n = 1; n <= nmax; n++) {
	Mn = function (x) { return M(n,x); };
	
	x[n] = Mn(x[n-1]);
	if (Q !== null) {
	    x[n] = nu.add(x[n],randnCovar(Q));
	    P[n] = nu.add(nu.transpose(P[n-1].map(Mn)).map(Mn),
			  Q);
	}


	time[n] = n;
	
	if (n == no[obsindex]) {
	    yo[obsindex] = H(obsindex,x[n]);
	    obsindex = obsindex+1;	
	}
    }
}


function KalmanFilter(xi,Pi,Q,M,nmax,no,yo,R,H,x,P,time) {
    var obsindex = 0, n, Mn, i, Hn, PH, HPH, K;

    x[0] = xi;
    P[0] = Pi;
    time[0] = 0;
    // obs index
    i = 1;
    // n time index
    // i index of x with forecast and analysis

    for (n = 1; n <= nmax; n++) {
	//console.log('n ',n);
	Mn = function (x) { return M(n,x); };

	x[i] = nu.add(Mn(x[i-1]),randnCovar(Q));
	P[i] = nu.add(nu.transpose(P[i-1].map(Mn)).map(Mn),
		      Q);
	
	time[i] = n;
	i = i+1;

	//P[n] = (M(P[n-1])).transpose();
	//console.log('assim row ',Pi.col(1));

	if (n == no[obsindex]) {
	    //console.log('assim ',n);

	    Hn = function (x) { return H(obsindex,x); };

	    PH = P[i-1].map(Hn);
	    HPH = nu.transpose(PH).map(Hn);

	    
	    K = nu.dot(PH,
		       nu.inv(nu.add(HPH,
				     R)));
	    
	    x[i] = nu.add(x[i-1],
			  nu.dot(K,
				 nu.sub(yo[obsindex],
					Hn(x[i-1]))));

	    P[i] = nu.sub(P[i-1],
			  nu.dot(K,
				 nu.transpose(PH)));
	    
	    time[i] = n;
	    i = i+1;

	    obsindex = obsindex+1;
	}
    }
}

// gaussian random numbers
function randn(size) { 
    var U,V,X;

    U = nu.random(size);
    V = nu.random(size);

    X = nu.mul(nu.sqrt(nu.mul(-2,
		     nu.log(U)
		    )),
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


AssimDemo.prototype.run = function () {
    var model = this.selectedModel(),
        M = model['fun'], n = model.n, Pi = model.Pi, Q = model.Q, R, xit, no, 
    H, yt, xt, timet, yo, xi, xfree, x, P, time, m, obs_var, obs_xsteps, obs_tsteps, i, nmax, Pfree;

    // seed for random numbers
    nu.seedrandom.seedrandom(parseFloat($('#randseed').val()));
    Math.random = nu.seedrandom.random;

    Pi = this.Pi.val();
    Q = this.Q.val();
    xit = this.xit.val();

    nmax = parseInt($('#nmax').val());
    obs_var = parseFloat($('#obs_var').val());
    obs_xsteps = parseFloat($('#obs_xsteps').val());
    obs_tsteps = parseFloat($('#obs_tsteps').val());

    // number of observations
    m = 1+Math.floor((n-1)  / obs_xsteps);

    // observation error covariance matrix
    R = nu.mul(obs_var, nu.identity(m));

    // time indices of observations
    no = range(obs_tsteps,nmax,obs_tsteps);

    // observation operator
    H = function(t,x) {
	var hx = [], i;
	for (i = 0; i < x.length; i+=obs_xsteps) {
	    hx.push(x[i]);
	}
	return hx;
    }

    // true run

    yt = [];
    xt = [];
    timet = [];

    FreeRun(xit,null,nmax,no,M,null,H,xt,null,yt,timet);

    // add perturbations to IC   
    xi = nu.add(xit, randnCovar(Pi));

    yo = [];
    
    // add perturbations

    for (i=0; i<no.length; i++) {
	yo[i] = nu.add(yt[i], randnCovar(R));
    }

    // free run
    //xi = xit;
    xfree = [];
    Pfree = [];
    FreeRun(xi,Pi,nmax,no,M,Q,H,xfree,Pfree,yt,timet);

    //console.log('yo ',yo[1]);
    x = [];
    P = [];
    time = [];

    KalmanFilter(xi,Pi,Q,M,nmax,no,yo,R,H,x,P,time);

    console.log('x ',x[x.length-1][0] == 1.3043300264354254,x[x.length-1][0]);

    this.result = {x: x, yo: yo, time: time, timet: timet, 
		   xfree: xfree, Pfree: Pfree,
		   xt: xt, no: no, P: P, obs_xsteps: obs_xsteps};

    this.plot();
};

AssimDemo.prototype.plot = function () {
    var x = this.result.x,
        yo = this.result.yo, 
        time = this.result.time, 
        timet = this.result.timet, 
        xfree = this.result.xfree, 
        Pfree = this.result.Pfree, 
        xt = this.result.xt, 
        P = this.result.P, 
    obs_xsteps = this.result.obs_xsteps,
    no = this.result.no,
    i,j;

    var obs = [];
    var statevector_index = parseInt($('#statevector_index').val());
    var covar_index_i = parseInt($('#covar_index_i').val());
    var covar_index_j = parseInt($('#covar_index_j').val());


    // statevector and observation plot

    var plot_data = [];

    function xtimeseries(time,x,checked,s) {
	var ts = [], n;

	if (checked) {
	    for (n=0; n<time.length; n++) {
		ts.push([time[n], x[n][statevector_index]]);
	    }
	    s.data = ts;
	    plot_data.push(s);
	}
    }

    xtimeseries(timet,xt,$('#show_truth').attr('checked'),{label: 'Truth',color: 0});
    xtimeseries(timet,xfree,$('#show_freerun').attr('checked'), {label: 'Free run',color: 1});    

    if ($('#show_observations').attr('checked')) {

	// observations to plot
	j = 0;
	for (i = 0; i < x[0].length; i+=obs_xsteps) {
	    // this condition will be true only once (at most)

	    if (i === statevector_index) {
		for (var n=0; n<yo.length; n++) {
		    obs.push([no[n], yo[n][j]]);
		}	    

		plot_data.push({
		    data: obs,  
		    label: 'Observations',
		    points: { show: true },
		    color: 3
		});

	    }
	    j = j+1;
	}
    }

    xtimeseries(time,x,$('#show_assimilation').attr('checked'), {label: 'Assimilation',color: 2});

    var plot = $.plot($("#state_vector"),plot_data);

    // covariance plot
    var plot_covar = [];

    function covartimeseries(time,P,checked,s) {
	var errvar = [], n;

	if (checked) {
	    for (n=0; n<time.length; n++) {
		errvar.push([time[n], P[n][covar_index_i][covar_index_j]]);
	    }
	    s.data = errvar;
	    plot_covar.push(s);
	}
    }

    covartimeseries(timet,Pfree,$('#show_covar_freerun').attr('checked'),{label: 'Free run', color: 1});
    covartimeseries(time,P,$('#show_covar_assimilation').attr('checked'),{label: 'Assimilation', color: 2});
    var plot2 = $.plot($("#error_covariance"),plot_covar);

};

$(document).ready(function() {
    demo = new AssimDemo();
    demo.run();   
});
