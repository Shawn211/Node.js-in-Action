var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');

var cache = {};

function send404(response){
    response.writeHead(404, {'Content-Type': 'text/plain'});
    response.write('Error 404: resource not found.');
    response.end();
}

function sendFile(response, filePath, fileContents){
    response.writeHead(
        200,
        {'Content-Type': mime.getType(path.basename(filePath))}
    );
    response.end(fileContents);
}

function serveStatic(response, cache, absPath){
    if(cache[absPath]){  // 检查文件是否缓存在内存中
        sendFile(response, absPath, cache[absPath]);  // 从内存中返回文件
    }else{
        fs.exists(absPath, function(exists){  // 检查文件是否存在
            if(exists){
                fs.readFile(absPath, function(err, data){  // 从硬盘中读取文件
                    if(err){
                        send404(response);
                    }else{
                        cache[absPath] = data;
                        sendFile(response, absPath, data);  // 从硬盘中读取文件并返回
                    }
                })
            }else{
                send404(response);  // 发送HTTP 404响应
            }
        })
    }
}

var server = http.createServer(function(req, res){
    var filePath = false;

    if(req.url == '/'){
        filePath = 'public/index.html';
    }else{
        filePath = 'public' + req.url;
    }
    
    var absPath = './' + filePath;
    serveStatic(res, cache, absPath);
});

var chatServer = require('./lib/chat_server');
chatServer.listen(server);

server.listen(8000, function(){
    console.log('Server listening on port 8000.');
});