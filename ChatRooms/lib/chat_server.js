var socketio = require('socket.io');
var io;
var guestNumber = 1;
var nickNames = {};  // id-name
var namesUsed = [];  // 已被占用名name
var currentRoom = {};  // id-room

// 新游客赋名
function assignGuestName(socket, guestNumber, nickNames, namesUsed){
    var name = 'Guest' + guestNumber;
    nickNames[socket.id] = name;
    socket.emit('nameResult', {
        success: true,
        name: name
    });
    namesUsed.push(name);
    return guestNumber + 1;
}

// 加入房间
function joinRoom(socket, room){
    socket.join(room);
    currentRoom[socket.id] = room;
    socket.emit('joinResult', {room: room});
    socket.broadcast.to(room).emit('message', {
        text: nickNames[socket.id] + ' has joined ' + room + '.'
    });

    // var usersInRoom = io.sockets.clients(room);
    // var usersInRoom = io.of('/').in(room).clients;
    // var usersInRoom = socket.adapter.rooms;

    var usersInRoom = [];
    count = 0;
    for(var userId in currentRoom){
        if(currentRoom[userId] === room){
            usersInRoom.push({id:userId});
            count += 1;
        }
    }

    // io.eio.clientsCount(eio:所有socket信息; clientsCount:socket数量)
    // socket.adapter.rooms(所有Room和Room下的socket)
    // socket.nsp.connected(超详细信息，包含第二个)

    // console.log(io.eio);
    // console.log(io.of('/').in(room));
    // console.log(socket.adapter.rooms);
    // console.log(socket.id);
    // console.log(io.eio.clientsCount);
    
    var usersCount = count;
    if(usersCount > 1){
        var usersInRoomSummary = 'Users currently in ' + room + ': ';
        var flag = 0;
        for(var index in usersInRoom){
            var userSocketId = usersInRoom[index].id;
            if(userSocketId != socket.id){
                if(index - flag > 0){
                    usersInRoomSummary += ', ';
                }
                usersInRoomSummary += nickNames[userSocketId];
            }else{
                flag += 1;
            }
        }
        usersInRoomSummary += '.';
        socket.emit('message', {text: usersInRoomSummary});
    }
}

// 更改名字
function handleNameChangeAttempts(socket, nickNames, namesUsed){
    socket.on('nameAttempt', function(name){
        if(name.indexOf('Guest') == 0){
            socket.emit('nameResult', {
                success: false,
                message: 'Names cannot begin with "Guest".'
            });
        }else{
            if(namesUsed.indexOf(name) == -1){
                var previousName = nickNames[socket.id];
                var previousNameIndex = namesUsed.indexOf(previousName);
                namesUsed.push(name);
                nickNames[socket.id] = name;
                delete namesUsed[previousNameIndex];
                socket.emit('nameResult', {
                    success: true,
                    name: name
                });
                socket.broadcast.to(currentRoom[socket.id]).emit('message', {
                    text: previousName + ' is now known as ' + name + '.'
                });
            }else{
                socket.emit('nameResult', {
                    success: false,
                    message: 'That name is already in use.'
                });
            }
        }
    });
}

// 传达信息
function handleMessageBroadcasting(socket){
    socket.on('message', function(message){
        socket.broadcast.to(message.room).emit('message', {
            text: nickNames[socket.id] + ': ' + message.text
        });
    });
}

// 创建房间
function handleRoomJoining(socket){
    socket.on('join', function(room){
        socket.leave(currentRoom[socket.id]);
        joinRoom(socket, room.newRoom);
    });
}

// 断开链接
function handleClientDisconnection(socket, nickNames, namesUsed){
    socket.on('disconnect', function(){
        var nameIndex = namesUsed.indexOf(nickNames[socket.id]);
        delete namesUsed[nameIndex];
        delete nickNames[socket.id];
        delete currentRoom[socket.id];
    })
}

exports.listen = function(server){
    io = socketio.listen(server);  // 启动Socket.IO服务器，允许它搭载在已有的HTTP服务器上
    // io.set('log level', 1);
    io.sockets.on('connection', function(socket){  // 定义每个用户连接的处理逻辑
        console.log('A user connected');
        guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed);  // 在用户连接上来时赋予其一个访客名
        joinRoom(socket, 'Lobby');  // 在用户连接上来时把他放入聊天室Lobby里

        // 处理用户的消息，更名，以及聊天室的创建和变更
        handleMessageBroadcasting(socket, nickNames);
        handleNameChangeAttempts(socket, nickNames, namesUsed);
        handleRoomJoining(socket);
        
        socket.on('rooms', function(){
            rooms = {};
            for(var userId in currentRoom){
                if(!(currentRoom[userId] in rooms)){
                    rooms[currentRoom[userId]] = true;
                }
            }
            // socket.emit('rooms', io.sockets.manager.rooms);  // 用户发出请求时，向其提供已经被占用的聊天室的列表
            // socket.emit('rooms', io.of('/').adapter.rooms);  // 用户发出请求时，向其提供已经被占用的聊天室的列表
            socket.emit('rooms', rooms);  // 用户发出请求时，向其提供已经被占用的聊天室的列表
        })

        handleClientDisconnection(socket, nickNames, namesUsed);  // 定义用户断开连接后的清除逻辑
    });
}