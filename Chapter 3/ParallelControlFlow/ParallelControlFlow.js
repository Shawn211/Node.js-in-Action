taskgos = [];

function one(l){
    console.log('I am one.');
    setTimeout(function(){console.log('one: ' + l.shift())}, 2111)
}

function two(l){
    console.log('I am two.');
    setTimeout(function(){console.log('two: ' + l.shift())}, 2111)
}

function three(l){
    console.log('I am three.');
    setTimeout(function(){console.log('three: ' + l.shift())}, 2111)
}

function last(l){
    console.log('I am last.');
    setTimeout(function(){console.log('love: ' + l.shift())}, 2111)
}

var task = [
    one,
    two,
    three,
    last
];

var l = [11, 21, 71, 211];

for(var index in task){
    taskfun = task[index];
    var taskgo = function(taskfun){
        return function(){
            taskfun(l);
        }
    }(taskfun);
    taskgos.push(taskgo);
}

// task.forEach(function(taskfun){
//     var taskgo = function(){
//         return function(){
//             taskfun(l);
//         }
//     }(taskfun);
//     taskgos.push(taskgo);
// });

for(var taskgo in taskgos){
    taskgos[taskgo]();
}