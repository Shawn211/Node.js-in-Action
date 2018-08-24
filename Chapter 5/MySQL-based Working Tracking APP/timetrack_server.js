var http = require('http');
var work = require('./lib/timetrack');
var mysql = require('mysql');

var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'timetrack'
});

var server = http.createServer(function(req, res){
    switch(req.method){
        case 'POST':
        switch(req.url){
            // 添加新记录
            case '/':
            work.add(db, req, res);
            break;

            // 归档记录
            case '/archive':
            work.archive(db, req, res);
            break;

            // 删除记录
            case '/delete':
            work.delete(db, req, res);
            break;
        }
        break;

        case 'GET':
        switch(req.url){
            // 展示未归档记录
            case '/':
            work.show(db, res);
            break;

            // 展示归档记录
            case '/archived':
            work.showArchived(db, res);
            break;
        }
        break;
    }
});

db.query(`
    CREATE TABLE IF NOT EXISTS work(
        id INT(10) NOT NULL AUTO_INCREMENT,
        hours DECIMAL(5,2) DEFAULT 0,
        date DATE,
        archived INT(1) DEFAULT 0,
        description LONGTEXT,
        PRIMARY KEY(id)
    )`,
    function(err){
        if(err) throw err;
        server.listen(8888);
        console.log('Server listening on port 8888');
    }
);