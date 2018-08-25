var redis = require('redis');
var client = redis.createClient(6379, 'localhost');

client.on('error', function(err){
    console.log('Error ' + err);
});

// // 存储和获取键/值对 set/get
// client.set('color', 'red', redis.print);
// client.get('color', function(err, value){
//     if(err) throw err;
//     console.log('Got: ' + value);
// });

// // 哈希表存储和获取数据 hmset/hget/hkeys
// client.hmset('camping', {
//     'shelter': '2-person tent',
//     'cooking': 'campstove'
// }, redis.print);
//
// client.hget('camping', 'cooking', function(err,value){
//     if(err) throw err;
//     console.log('Will be cooking with: ' + value);
// });
//
// client.hkeys('camping', function(err, keys){
//     if(err) throw err;
//     keys.forEach(function(key, i){
//         console.log(' ' + key);
//     });
// });

// // 链表存储和获取数据 lpush/lrange
// client.lpush('tasks', 'Paint the bikeshed red.', redis.print);
// client.lpush('tasks', 'Paint the bikeshed green.', redis.print);
// client.lrange('tasks', 0, -1, function(err, items){
//     if(err) throw err;
//     items.forEach(function(item, i){
//         console.log(' ' + item);
//     });
// });

// 集合存储和获取数据 sadd/smembers
client.sadd('ip_addresses', '204.10.37.96', redis.print);
client.sadd('ip_addresses', '204.10.37.96', redis.print);
client.sadd('ip_addresses', '72.32.231.8', redis.print);
client.smembers('ip_addresses', function(err, members){
    if(err) throw err;
    console.log(members);
});