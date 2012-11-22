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

"use strict";

var nu = numeric;
var pp = numeric.prettyPrint;
var demo;

// parse query string
var qs = (function(a) {
    if (a === "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i)
    {
        var p=a[i].split('=');
        if (p.length != 2) continue;
        b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
})(window.location.search.substr(1).split('&'));

function str2mat(str) {
    var rows = str.split(/ *; */);
    return rows.map(function (r) { return r.split(/ *, */).map(parseFloat); });

}
function mat2str(A) {
    //return A.map(function (c) { return c.toString() }).join('; ');
    return A.map(function (c) { return c.join(', '); }).join(';  ');
}

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

function MatInput(size, id) {
    var i, j, $row, $tbody;
    this.size = size;
    this.id = id;
    this.$elem = [];

    // create table for matrix
    $('#' + id).empty();
    $('#' + id).append($('<table/>').attr({'class': 'matrix'}).
                       append($tbody = $('<tobdy/>')));


    if (this.size.length === 1) {
        $row = $('<tr/>');

        for (i = 0; i < size[0]; i++) {
            this.$elem[i] = $('<input/>').attr({'type':'text','size': '1','class': 'matrix_element'});

            $row.append($('<td/>').
                        append(this.$elem[i]));
        }
        
        $tbody.append($row);
    } else {
        for (i = 0; i < size[0]; i++) {
            this.$elem[i] = [];
            $row = $('<tr/>');
            for (j = 0; j < size[1]; j++) {
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
            for (i = 0; i < this.size[0]; i++) {
                this.$elem[i].val(data[i]);
            }
        }
        else {
            // get value
            data = [];
            
            for (i = 0; i < this.size[0]; i++) {
                data[i] = parseFloat(this.$elem[i].val());
            }
        }
        return data;
    }

    else {
        if (data) {
            // fill-in
            for (i = 0; i < this.size[0]; i++) {
                for (j = 0; j < this.size[1]; j++) {
                    this.$elem[i][j].val(data[i][j]);
                }
            }
        }
        else {
            // get value
            data = [];
            
            for (i = 0; i < this.size[0]; i++) {
                data[i] = [];

                for (j = 0; j < this.size[1]; j++) {
                    data[i][j] = parseFloat(this.$elem[i][j].val());
                }
            }
            return data;
        }
    }

    return null;
};


function AssimDemo() {
    var m, that = this;

    this.models = [
        {'title': 'Identity matrix',
         'name': 'id',
         'fun': function(t,x) {
             return x;
         },
         'fun_adj': function(t,x) {
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
         'fun_adj': function(t,x) {
             return nu.dot(nu.transpose([[0,1,0,0],[0,0,1,0],[0,0,0,1],[1,0,0,0]]),x);
         },
         'n': 4,
         'xit': [1.5,2,3,4],
         'Pi': nu.identity(4),
         'Q': nu.rep([4,4],0),
         'formula': 
         '\\begin{equation}     ' +
	 '\\mathbf x^{(n+1)} =  ' +
	 '\\left(               ' +
	 '\\begin{array}{cccc}  ' +
	 '0 & 1 & 0 & 0 \\\\    ' +
	 '0 & 0 & 1 & 0 \\\\    ' +
	 '0 & 0 & 0 & 1 \\\\    ' +
	 '1 & 0 & 0 & 0         ' +
	 '\\end{array}          ' +
	 '\\right)              ' +
	 '\\mathbf x^{(n)}      ' +
	 '\\end{equation}       ' 
	 },

        {'title': 'oscillation',
         'name': 'oscillation',
         'fun': (function() {             
             var f=2*Math.PI, Dt = 0.1, L, M;
             /*
             // Crank-Nicolson
             L = [[0,f],[-f,0]];
             M = nu.dot(nu.inv(nu.add(nu.identity(2),nu.mul(-Dt/2,L))),
             nu.add(nu.identity(2),nu.mul(Dt/2,L)));
             */
             M = [[Math.cos(f*Dt), Math.sin(f*Dt)], [-Math.sin(f*Dt), Math.cos(f*Dt)]];
             return function(t,x) { return nu.dot(M,x); };
         }()),
         'n': 2,
         'xit': [1,0],
         'Pi': nu.identity(2),
         'Q': nu.rep([2,2],0),
         'formula': 
	 '\\begin{eqnarray} ' +
	 '\\frac{dx_1}{dt}  &=& f x_2 \\\\ ' +
	 '\\frac{dx_2}{dt}  &=& -f x_1 ' +
	 '\\end{eqnarray}'}

    ];   


    for (m in this.models)  {
	if (this.models.hasOwnProperty(m)) {
            $('#model').append($('<option />').attr({'value': this.models[m].name}).html(this.models[m].title));
	}
    }

    $('#model').append($('<option />').attr({'value': 'myfun'}).text('My function in JavaScript'));

    $('#method').val(qs['method'] || 'KF');
    // default model
    $('#model').val(qs['model'] || 'advection');

    // install event handlers

    $('#model, #statevector_size').change(function() {
        that.updateModel();
    });

    $('#method').change(function() {
	that.method = $('#method').val();

	if (that.method === 'Nudging') {
	    $('.Nudging').show();
	}
	else {
	    $('.Nudging').hide();
	}
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

    this.updateModel();
    $('#method').change();
}

AssimDemo.prototype.updateModel = function() {
    var m, i;
    
    if ($('#model').val() === 'myfun') {
        $("#statevector_size").removeAttr('disabled');	
	$('#statevector_size').val(2);
        $(".predefined_model").hide();
        $('.custom_model').show();
    }
    else {
        $("#statevector_size").attr('disabled', 'disabled');
        $(".predefined_model").show();
        $('.custom_model').hide();
    }

    // get selected model
    m = this.selectedModel();

    if (m === null) {
        return;
    }

    //console.log(m.title);
    $('#statevector_size').val(m.n);

    $('#model_eqn').empty();
    //$('#model_eqn').append($('<script/>').attr({'type': 'math/tex; mode=display'}).html(m.formula));
    $('#model_eqn').append($('<script/>').attr({'type': 'math/tex; mode=display'}).text(m.formula));
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

    if (m === null) {
        return;
    }

    this.Pi.val(m.Pi);
    this.Q.val(m.Q);
    this.xit.val(m.xit);

    $('#nmax').val(40);
    $('#obs_xsteps').val(2);
    $('#obs_tsteps').val(5);
    $('#obs_var').val(0.2);
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
    var modelname = $('#model').val(), n, fun;

    if (modelname === 'myfun') {
        n = $('#statevector_size').val();

        try {
            fun = new Function('n','x',$('#model_code').val());
        }
        catch (err) {
            alert('JavaScript error: please check your model code\n' + err);
            return null;
        }

        return {'title': 'myfun',
		'name': 'myfun',
		'fun': fun,
		'n': n,
		'xit': nu.rep([n],0),
		'Pi': nu.identity(n),
		'Q': nu.rep([n,n],0),
		'formula': ''};
    }
    else {
        return this.models.filter(function (m)  { return m.name === modelname; })[0];
    }
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
    var obsindex = 0, n, i, res;

    function gradient(x0) {
	var x, i, grad;
    
	x[0] = x0;
	// obs index
	i = 1;

	// n time index
	// i index of x with forecast and analysis

	// foreward integration
	for (n = 0; n <= nmax-1; n++) {
            x[n+1] = nu.add(M(n,x[n]),randnCovar(Q));
	}

	// backward integration
	lambda[nmax+1] = nu.rep([xi.length],0);
	i = nmax;
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

	grad = nu.mul(-2,grad);

    }

	// correction of IC
	x[0] = nu.add(xi,
		  nu.dot(Pi,MT(0,lambda[0])));

    // foreward run with corrected IC
    for (n = 1; n <= nmax; n++) {
        x[n] = nu.add(M(n,x[n-1]),randnCovar(Q));
    }


}


AssimDemo.prototype.run = function () {
    var model = this.selectedModel(),
    M, MT, n, Pi, Q, R, xit, no, io,
    H, HT, yt, xt, timet, yo, xi, xfree, x, P, time, m, obs_var, obs_xsteps, obs_tsteps, i, nmax, Pfree, options, tau;

    if (model === null) {
        return;
    }

    M = model.fun;
    n = model.n;
    Pi = model.Pi;
    Q = model.Q;

    // seed for random numbers
    nu.seedrandom.seedrandom(parseFloat($('#randseed').val()));
    Math.random = nu.seedrandom.random;

    Pi = this.Pi.val();
    Q = this.Q.val();
    xit = this.xit.val();

    nmax = parseInt($('#nmax').val(),10);
    obs_var = parseFloat($('#obs_var').val());
    obs_xsteps = parseFloat($('#obs_xsteps').val());
    obs_tsteps = parseFloat($('#obs_tsteps').val());

    // time indices of observations
    no = range(obs_tsteps,nmax,obs_tsteps);

    // space indices of observations
    io = range(0,n-1,obs_xsteps);

    // number of observations
    m = io.length;

    // observation error covariance matrix
    R = nu.mul(obs_var, nu.identity(m));

    console.log('indices obs',io,m);
    // observation operator
    H = function(t,x) {
        var hx = [], i;
        for (i in io) {
	    if (io.hasOwnProperty(i)) {
		hx.push(x[io[i]]);
	    }
        }
        return hx;
    };

    // adjoint of observation operator
    HT = function(t,y) {
        var x = [], j;
	x = nu.rep([n],0);

	// loop over all "observations"
        for (j = 0; j < y.length; j += 1) {
	    x[io[j]] = y[j];
        }
        return x;
    };

    // true run

    yt = [];
    xt = [];
    timet = [];

    FreeRun(xit,null,nmax,no,M,null,H,xt,null,yt,timet);

    // add perturbations to IC   
    xi = nu.add(xit, randnCovar(Pi));

    yo = [];
    
    // add perturbations

    for (i = 0; i < no.length; i++) {
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
    options = {method: this.method};

    if (options.method === 'Nudging') {
	tau = $('#nudging_ts').val();
	Nudging(xi,Q,M,nmax,no,yo,io,tau,x,time);
    }
    else if (options.method === '4DVar') {
	MT = model.fun_adj;	
	var lambda = [];
	FourDVar(xi,Pi,Q,M,MT,nmax,no,yo,R,H,HT,x,lambda,time);
    }
    else {
        KalmanFilter(xi,Pi,Q,M,nmax,no,yo,R,H,x,P,time,options);
	console.log('x ',x[x.length-1][0] === 1.3043300264354254,x[x.length-1][0]);
    }
    
    this.result = {x: x, yo: yo, time: time, timet: timet, 
                   xfree: xfree, Pfree: Pfree,
                   xt: xt, no: no, P: P, obs_xsteps: obs_xsteps, lambda: lambda};

    this.plot();
};

AssimDemo.prototype.plot = function () {
    var i,j,n,x = this.result.x,
    yo = this.result.yo, 
    time = this.result.time, 
    timet = this.result.timet, 
    xfree = this.result.xfree, 
    Pfree = this.result.Pfree, 
    xt = this.result.xt, 
    P = this.result.P, 
    obs_xsteps = this.result.obs_xsteps,
    no = this.result.no,
    lambda = this.result.lambda;

    var obs = [];
    var statevector_index = parseInt($('#statevector_index').val(),10);
    var covar_index_i = parseInt($('#covar_index_i').val(),10);
    var covar_index_j = parseInt($('#covar_index_j').val(),10);
    var plot_covar = [];
    var plot_data = [];


    // statevector and observation plot


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
                for (n=0; n < yo.length; n++) {
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

    if (this.method === 'KF' || this.method === 'OI') {
	// covariance plot
	$('#error_covariance').parent('fieldset').show();

	
	covartimeseries(timet,Pfree,$('#show_covar_freerun').attr('checked'),{label: 'Free run', color: 1});
	covartimeseries(time,P,$('#show_covar_assimilation').attr('checked'),{label: 'Assimilation', color: 2});
	$.plot($("#error_covariance"),plot_covar);
    }
    else {
	$('#error_covariance').parent('fieldset').hide();
    }

    if (this.method === '4DVar') {
	$('#adjoint_sensitivity').parent('fieldset').show();

	plot_data = [];	
	xtimeseries(time,lambda,true, {label: 'Sens',color: 2});
	$.plot($("#adjoint_sensitivity"),plot_data);
    }
    else {
	$('#adjoint_sensitivity').parent('fieldset').hide();
    }

//lambda_index_i

};

$(document).ready(function() {
    demo = new AssimDemo();
    demo.run();   


    
});

function test_conjugategradient(){
var fun = function(x) { return nu.dot([[1,0.1],[0.1,1]],x); };
var b = [1,2];

var xa = conjugategradient(fun,b,{tol: 1e-6, maxit: 20, x0: [1,1]});

console.log('conjugategradient',nu.sub(fun(xa),b))
}

test_conjugategradient()


//FourDVar(xi,Pi,Q,M,MT,nmax,no,yo,R,H,HT,x,lambda,time)