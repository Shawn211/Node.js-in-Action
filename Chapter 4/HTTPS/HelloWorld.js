var https = require('https');
var fs = require('fs');

var options = {
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./key-cert.pem')
}

var server = https.createServer(options, function(req, res){
    res.writeHead(200);
    res.end('<h1>Hello World!</h1>')
});

server.listen(8888);
console.log('Server listening on port 8888');