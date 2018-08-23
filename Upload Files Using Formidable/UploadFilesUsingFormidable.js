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

function show(req, res){
    var html = `<form method="post" action="/" enctype="multipart/form-data">
                    <p><input type="text" name="name"></input></p>
                    <p><input type="file" name="file"></input></p>
                    <p><input type="submit" value="Upload"></input></p>
                    <p id="percent"></p>
                </form>`;
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
    });
}

function isFormData(req){
    var type = req.headers['content-type'] || '';
    return 0 == type.indexOf('multipart/form-data');
}