
n=new Bayes.Node('smoke',['yes','no']);
n.cpt=[0.4,0.6];  
var ncl=n;
Bayes.nodes.push(n);

n=new Bayes.Node('sick',['yes','no']);
n.parents.push(ncl);
n.cpt=[[0.75,0.25],[0.167,0.833]];
var nsp=n;
Bayes.nodes.push(n);

// -------------------

var _show_prob = function (_prob1, _prob2) {    
Bayes.sample(10000);
console.log(JSON.stringify([
    _prob(Bayes.nodes[0].sampledLw),
    _prob1,
    "|",
    _prob(Bayes.nodes[1].sampledLw),
    _prob2,
]));
};

var _prob = function (_ary) {
    var _sum = _ary.reduce(function(a, b) { return a + b; }, 0);
    var _ary2 = [];
    for (var _i = 0; _i < _ary.length; _i++ ) {
        var _p = _ary[_i] / _sum;
        _p = Math.round(_p * 10000) / 10000;
        _ary2.push(_p);
    }
    return _ary2;
};

_show_prob([0.4, 0.6], [0.4, 0.6]);

Bayes.nodes[0].value = 0;
Bayes.nodes[0].isObserved = true;
_show_prob([1, 0], [0.75, 0.26]);

Bayes.nodes[0].value = undefined;
Bayes.nodes[0].isObserved = false;
_show_prob([0.4, 0.6], [0.4, 0.6]);

Bayes.nodes[1].value = 0;
Bayes.nodes[1].isObserved = true;
_show_prob([0.75, 0.25], [1, 0]);
