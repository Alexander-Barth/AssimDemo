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
    var b, i, p;
    if (a === "") { return {}; }
    b = {};
    for (i = 0; i < a.length; ++i)
    {
        p=a[i].split('=');
        if (p.length !== 2) { continue; }
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
    
    this.plots = [];

    this.models = [
        {'title': 'Identity matrix',
         'name': 'id',
         'fun': function(t,x) {
             return x;
         },
         'fun_adj': function(t,x,dx) {
             return dx;
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

         'fun_adj': function(t,x,dx) {
             return nu.dot(nu.transpose([[0,1,0,0],[0,0,1,0],[0,0,0,1],[1,0,0,0]]),dx);
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

        //---------------------------------------------

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

         'fun_adj': (function() {             
             var f=2*Math.PI, Dt = 0.1, L, M;
             /*
             // Crank-Nicolson
             L = [[0,f],[-f,0]];
             M = nu.dot(nu.inv(nu.add(nu.identity(2),nu.mul(-Dt/2,L))),
             nu.add(nu.identity(2),nu.mul(Dt/2,L)));
             */
             M = [[Math.cos(f*Dt), Math.sin(f*Dt)], [-Math.sin(f*Dt), Math.cos(f*Dt)]];
             return function(t,x,dx) { return nu.dot(nu.transpose(M),dx); };
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

        ,


        //---------------------------------------------

        function() {
             var a=2*Math.PI, b = Math.PI, Dt = 0.1, L, M;

             // Crank-Nicolson
             L = [[0,0,-a,-b],
                  [0,0,-b,-a],
                  [a,b,0,0],
                  [b,a,0,0]];
             M = nu.dot(nu.inv(nu.add(nu.identity(4),nu.mul(-Dt/2,L))),
             nu.add(nu.identity(4),nu.mul(Dt/2,L)));

            return      {'title': 'Two oscillations',
         'name': 'oscillation2',
         'fun': (function() {             

             return function(t,x) { return nu.dot(M,x); };
         }()),

         'fun_adj': (function() {             
             return function(t,x,dx) { return nu.dot(nu.transpose(M),dx); };
         }()),

                         'n': 4,
                         'xit': [1,0,0,0],
         'Pi': nu.identity(4),
         'Q': nu.rep([4,4],0),
                         'formula': 
                         '\\frac{d \\mathbf{x}}{dt} = \\left(' +
                         '\\begin{array}{c c c c}' +
                         '  0 & 0 & -a & -b \\\\' +
                         '  0 & 0 & -b & -a \\\\' +
                         '  a & b & 0  & 0  \\\\' +
                         '  b & a & 0  & 0  \\\\' +
                         '\\end{array}' +
                         '\\right)' +
                         '\\mathbf x'
                        };
        }()
        ,

        //---------------------------------------------
        // Lorenz

        function() {
            var sigma=10, beta = 8/3, rho = 28, dt=0.05;
            var f = function(t,x) {
                return [sigma*(x[1]-x[0]),
                        x[0]*(rho-x[2]) - x[1],
                        x[0]*x[1] - beta * x[2]];
            };

            var f_tgl = function(t,x,dx) {    
                var M = [[  -sigma, sigma,      0],
                         [rho-x[2],    -1,  -x[0]],
                         [    x[1],  x[0],  -beta]];
                var tmp = nu.dot(M,dx);
                //return nu.transpose(tmp)[0];
                return tmp;
            };

            var f_adj = function(t,x,dx) {    
                var M = [[  -sigma, sigma,      0],
                         [rho-x[2],    -1,  -x[0]],
                         [    x[1],  x[0],  -beta]];
                var tmp = nu.dot(nu.transpose(M),dx);
                //return nu.transpose(tmp)[0];
                return tmp;
            };

            return {'title': 'Lorenz (1963)',
                    'name': 'Lorenz63',
                    'fun': function(n,x) {
                        return rungekutta2(0,x,dt,f);
                    },
                    'fun_tgl': function(n,x,dx) {
                        return rungekutta2_tgl(0,x,dt,f,dx,f_tgl);
                    },                  
                    'fun_adj': function(n,x,dx) {
                        return rungekutta2_adj(0,x,dt,f,dx,f_adj);
                    },
                    'n': 3,
                    'xit': [1,0,0],
                    'Pi': nu.identity(3),
                    'Q': nu.rep([3,3],0),
                    'formula': 
                    '\\begin{align} ' +
                    '\\frac{dx}{dt} &= \\sigma (y - x) \\\\' +
                    '\\frac{dy}{dt} &= x (\\rho - z) - y \\\\' +
                    '\\frac{dz}{dt} &= x y - \\beta z' +
                    '\\end{align} '
                   };
        }()



    ];   


    for (m in this.models)  {
        if (this.models.hasOwnProperty(m)) {
            $('#model').append($('<option />').attr({'value': this.models[m].name}).html(this.models[m].title));
        }
    }

    $('#model').append($('<option />').attr({'value': 'myfun'}).text('My function in JavaScript'));

    $('#method').val(qs.method || 'KF');
    // default model
    $('#model').val(qs.model || 'advection');
    $('#nudging_ts').val(qs.nudging_ts || '40');

    // install event handlers

    $('#model, #statevector_size').change(function() {
        that.updateModel();
    });

    $('#method').change(function() {
        that.method = $('#method').val();

        $('.Nudging').hide();
        $('.4DVar').hide();
        $('.EnKF').hide();
        
        // method is also CSS class name
        $('.' + that.method).show();
    });
    
    $('.plot_param').find('input, select').change(function() {
        that.plot();
    });

    $('form').submit(function(e) {
        e.preventDefault();
        that.run();
        return false;
    });

    $('#reset').click(function() {
        that.resetModel();
    });

    $('#download').click(function() {
        that.download();
    });

    $(window).resize(function() {
        that.resize();
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

    // add equation
    var scriptTag = document.createElement('script');
    scriptTag.text = m.formula;
    //scriptTag.text = 'a+b';
    scriptTag.type = 'math/tex; mode=display';
    scriptTag.style.visibility = "hidden";
    document.getElementById('model_eqn').style.visibility = "hidden";
    document.getElementById('model_eqn').appendChild(scriptTag);

    MathJax.Hub.Queue(
        ["Typeset",MathJax.Hub,scriptTag],
        function() {
            // show equation after type setting
            document.getElementById('model_eqn').style.visibility = "";
        }
    );   

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

    $('#nmax').val(qs.nmax || 40);
    $('#Nens').val(qs.Nens || 100);
    $('#inflation').val(qs.inflation || 1);
    $('#innerloops').val(qs.innerloops || 30);
    $('#outerloops').val(qs.outerloops || 30);

    $('#obs_xsteps').val(qs.obs_xsteps || 2);
    $('#obs_tsteps').val(qs.obs_tsteps || 5);
    $('#obs_var').val(qs.obs_var || 0.2);
    $('#randseed').val(qs.randseed || 3);

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


AssimDemo.prototype.run = function () {
    var model = this.selectedModel(),
    M, Mtgl, MT, n, Pi, Q, R, xit, no, io,
    H, HT, yt, xt, timet, yo, xi, xfree, x, P, time, m, obs_var, obs_xsteps, obs_tsteps, i, nmax, Pfree, options, tau,
    lambda = [], J = [];

    if (model === null) {
        return;
    }

    $('#loading').show();

    M = model.fun;
    Mtgl = model.fun_tgl || function (n,x,dx) { return M(n,dx); };
    n = model.n;
    Pi = model.Pi;
    Q = model.Q;
    
    // seed for random numbers
    nu.seedrandom.seedrandom(parseFloat($('#randseed').val()));
    Math.random = nu.seedrandom.random;

    Pi = this.Pi.val();
    Q = this.Q.val();
    xit = this.xit.val();

    // square-root matrices
    var QS = covarDecomp(Q);
    var PiS = covarDecomp(Pi);

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

    FreeRun(xit,null,nmax,no,M,Mtgl,null,H,xt,null,yt,timet);

    // add perturbations to IC   
    xi = nu.add(xit, randnCovar(Pi));

    
    // add perturbations to obs
    yo = [];
    for (i = 0; i < no.length; i++) {
        yo[i] = nu.add(yt[i], randnCovar(R));
    }

    var E = []; // ensemble
    var Nens = parseInt($('#Nens').val(),10);

    // free run
    //xi = xit;
    xfree = [];
    Pfree = [];


    var startTime=new Date();

    FreeRun(xi,Pi,nmax,no,M,Mtgl,QS,H,xfree,Pfree,yt,timet);


    /*
      var Ef = [];
      var xfreeEns = [];
      var PfreeEns = [];
      // run without observations to get ensemble spread of free run
      EnsembleKalmanFilter(xi,PiS,QS,M,nmax,[],yo,R,H,Ef,timet,{Nens: Nens});
      EnsembleDiag(Ef,xfreeEns,PfreeEns);
    */

    var endTime=new Date();
    console.log('free run in ',endTime-startTime,' ms');

    //console.log('yo ',yo[1]);
    x = [];
    P = [];
    time = [];
    options = {method: this.method};
    

    startTime=new Date() ;

    if (options.method === 'Nudging') {
        tau = parseFloat($('#nudging_ts').val());
        Nudging(xi,Q,M,nmax,no,yo,io,tau,x,time);
    }
    else if (options.method === '4DVar') {
        var innerloops = parseFloat($('#innerloops').val());
        var outerloops = parseFloat($('#outerloops').val());
        MT = model.fun_adj; 
        if (MT) {
            FourDVar(xi,Pi,Q,M,Mtgl,MT,nmax,no,yo,R,H,HT,x,lambda,J,time,{innerloops: innerloops, outerloops: outerloops});
        }
        else {
            alert('There is currently no adjoint for the selected model. Sorry');
        }
    }
    else if (options.method === 'EnKF') {
        var inflation = parseFloat($('#inflation').val());

        EnsembleKalmanFilter(xi,PiS,QS,M,nmax,no,yo,R,H,E,time,{Nens: Nens, inflation: inflation});        
        EnsembleDiag(E,x,P);

        console.log('x ',x[x.length-1][0] === 1.3137242479551203,x[x.length-1][0]);

    }
    else {
        KalmanFilter(xi,Pi,QS,M,Mtgl,nmax,no,yo,R,H,x,P,time,options);
        console.log('x ',x[x.length-1][0] === 1.3043300264354254,x[x.length-1][0]);
    }

    endTime=new Date();
    console.log('assimilation run in ',endTime-startTime,' ms');
    
    this.result = {x: x, yo: yo, time: time, timet: timet, 
                   xfree: xfree, Pfree: Pfree,
                   xt: xt, no: no, P: P, obs_xsteps: obs_xsteps, lambda: lambda, J: J};

    $('#loading').hide();
    this.plot();
};

AssimDemo.prototype.download = function () {
    //console.log(this.result);

    var blob = new Blob([JSON.stringify(this.result)], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "result.json");
};

AssimDemo.prototype.resize = function () {
    function parsePx(px) {
        return parseInt(px.replace('px',''),10);
    }
    var i;

    if (this.plots.length === 0) {
        return;
    }

    var minWidth = parsePx($('body').css('min-width'));
    var padding = parsePx($('.plot:first').css('padding-left')) +
        parsePx($('.plot:first').css('padding-right'));
    var margin = parsePx($('.plot:first').css('margin-left')) +
        parsePx($('.plot:first').css('margin-right'));
    var border = parsePx($('.plot:first').css('border-left-width')) +
        parsePx($('.plot:first').css('border-right-width'));
    var bmargin = parsePx($('body').css('margin-left')) +
        parsePx($('body').css('margin-right'));


    var windowWidth = Math.max($(window).width(),minWidth);

    $('.plot .figure').css('width',windowWidth - padding - margin - border - bmargin);

    for (i = 0; i < this.plots.length; i++) {
        // call flots resize routines
        this.plots[i].resize();
        this.plots[i].setupGrid();
        this.plots[i].draw();
    }
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
    lambda = this.result.lambda,
    J = this.result.J;

    var obs = [];
    var statevector_index = parseInt($('#statevector_index').val(),10);
    var covar_index_i = parseInt($('#covar_index_i').val(),10);
    var covar_index_j = parseInt($('#covar_index_j').val(),10);
    var plot_covar = [];
    var plot_data = [];

    this.plots = [];

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
        for (i = 0; i < xfree[0].length; i+=obs_xsteps) {
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

    this.plots.push($.plot($("#state_vector"),plot_data));

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

    if (this.method === 'KF' || this.method === 'OI' || this.method === 'EnKF') {
        // covariance plot
        $('#error_covariance').parent('fieldset').show();

        
        covartimeseries(timet,Pfree,$('#show_covar_freerun').attr('checked'),{label: 'Free run', color: 1});
        covartimeseries(time,P,$('#show_covar_assimilation').attr('checked'),{label: 'Assimilation', color: 2});
        this.plots.push($.plot($("#error_covariance"),plot_covar));
    }
    else {
        $('#error_covariance').parent('fieldset').hide();
    }

    if (this.method === '4DVar') {
        $('#cost_function').parent('fieldset').show();
        this.plots.push($.plot($("#cost_function"),[{data: nu.transpose([range(0,J.length-1),J]) }]));
    }
    else {
        $('#cost_function').parent('fieldset').hide();
    }

    if (this.method === '4DVar-xx') {
        $('#adjoint_sensitivity').parent('fieldset').show();

        plot_data = []; 
        xtimeseries(time,lambda,true, {label: 'Sens',color: 2});
        this.plots.push($.plot($("#adjoint_sensitivity"),plot_data));
    }
    else {
        $('#adjoint_sensitivity').parent('fieldset').hide();
    }

    //lambda_index_i

};

$(document).ready(function() {
    demo = new AssimDemo();
    demo.run();   

    if (qs.test) {
        test_conjugategradient();
        test_fourDVar();
        test_EnsembleAnalysis();
        test_model(demo.models.filter(function(m) { return m.name === 'Lorenz63'; })[0],0);
    }    
});


