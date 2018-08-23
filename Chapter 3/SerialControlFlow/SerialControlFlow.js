function one(){
    var l = [11, 21, 71, 211];
    console.log('one: ' + l.shift())
    next(l);
}

function two(l){
    console.log('two: ' + l.shift());
    next(l);
}

function three(l){
    console.log('three: ' + l.shift());
    next(l);
}

function last(l){
    console.log('love: ' + l.shift());
}

var task = [
    one,
    two,
    three,
    last
];

function next(result){
    var taskfun = task.shift();
    taskfun(result);
}

next();