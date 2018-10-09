var http = require('http');
var formidable = require('formidable');

var server = http.createServer(function(req, res){
    switch(req.method){
        case 'GET':
        show(req, res);
        break;

        case 'POST':
        upload(req, res);
        break;
    }
});
server.listen(8888);
console.log('Server listening on port 8888');
// socket.io 监听 server 并实例化
// var io = require('socket.io')(server)
var io = require('socket.io').listen(server)

function show(req, res){
    var html = `<form method="post" action="/" enctype="multipart/form-data">
                    <p><input type="text" name="name"></input></p>
                    <p><input type="file" name="file"></input></p>
                    <p><input type="submit" value="Upload"></input></p>
                    
                    <!-- preShow 显示灰色全进度条，show 显示蓝色当前进度条，percent 显示当前进度。 -->
                    <div id="preShow" style="background-color: #999999; width: 71%; height: 0px; position: absolute; z-index: -1;"></div>
                    <div id="show" style="background-color: #3fe1fd; width: 0%; height: 10px;"></div>
                    <p id="percent"></p>
                </form>
                
                <!-- 引入 socket.io，需在被引用前引入。 -->
                <script src="/socket.io/socket.io.js"></script>

                <!-- 监听 socket.io progress 事件，当被触发时，展示进度、灰色全进度条、蓝色当前进度条。 -->
                <script>
                    var socket = io.connect()
                    socket.on("progress", function(data){
                        document.getElementById("percent").innerText = "Progress percent: " + data.percent + "%";
                        document.getElementById("preShow").style.height = "10px";
                        document.getElementById("show").style.width = data.percent / 100 * document.getElementById("preShow").offsetWidth + "px";
                    })
                </script>`;
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Lenght', Buffer.byteLength(html));
    res.end(html);
}

function upload(req, res){
    if(!isFormData(req)){
        res.statusCode = 400;
        res.end('Bad Request: expecting multipart/form-data');
        return;
    }

    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, names){
        console.log(fields);
        console.log(names);
    });
    show(req, res);

    form.on('progress', function(bytesReceived, bytesExpected){
        var percent = Math.floor(bytesReceived / bytesExpected * 100);
        console.log(percent);
        // 监听 Form progress 事件，该事件被触发时触发 socket.io 的 progress 事件
        io.emit('progress', {percent: percent})
    });
}

function isFormData(req){
    var type = req.headers['content-type'] || '';
    return 0 == type.indexOf('multipart/form-data');
}