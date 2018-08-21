var events = require('events');
var util = require('util');

// Watcher类的构造器
function Watcher(watchDir, processedDir){
    this.watchDir = watchDir;
    this.processedDir = processedDir;
}

util.inherits(Watcher, events.EventEmitter);  // 用inherits函数继承另一个对象里的行为
// Watcher.prototype = new events.EventEmitter();

var fs = require('fs');
var watchDir = './watch';
var processedDir = './done';

Watcher.prototype.watch = function(){
    var watcher = this;
    fs.readdir(this.watchDir, function(err, files){
        if(err) throw err;
        for(var index in files){
            watcher.emit('process', files[index]);
        }
    });
}

Watcher.prototype.start = function(){
    var watcher = this;
    fs.watchFile(watchDir, function(){
        watcher.watch();
    });
}

var watcher = new Watcher(watchDir, processedDir);

watcher.on('process', function process(file){
    var watchDir = this.watchDir + '/' + file;
    var processedDir = this.processedDir + '/' + file.toLowerCase();
    fs.rename(watchDir, processedDir, function(err){
        if(err) throw err;
    });
});

watcher.start();