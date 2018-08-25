var net = require('net');
var redis = require('redis');

var server = net.createServer(function(socket){  // 为每个连接到聊天服务器上的用户定义设置逻辑
    var subscriber;
    var publisher;

    subscriber = redis.createClient();  // 为用户创建预订客户端
    subscriber.subscribe('main_chat_room');

    subscriber.on('message', function(channel, message){  // 信道收到消息后，把它发给用户
        socket.write('Channel ' + channel + ': ' + message);
    });

    publisher = redis.createClient();  // 为用户创建发布客户端

    socket.on('data', function(data){
        publisher.publish('main_chat_room', data);
    });

    socket.on('end', function(){
        subscriber.unsubscribe('main_chat_room');
        subscriber.end();
        publisher.end();
    });
});

server.listen(8888);
console.log('Server listening on port 8888');