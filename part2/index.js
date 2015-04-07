/**
 * Module dependencies.
 */

var express = require('express');

/**
 * Create Express server.
 */

var app = express();
var server = require('http').Server(app),
    io = require('socket.io')(server);

/**
 * Socket
 */

var users = [];

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.emit('system', {
        type: 'init',
        users: users
    });
    socket.on('system', function (message) {
        if (message.type === 'enter') {
            users.push(message.name);
            socket.userName = message.name;
            socket.broadcast.emit('system', message);
            socket.emit('system', message);
        }
    });
    socket.on('message', function (message) {
        socket.broadcast.emit('message', {
            name: socket.userName,
            text: message
        });
        socket.emit('message', {
            name: socket.userName,
            text: message
        });
    });
    socket.on('disconnect', function () {
        if (socket.userName) {
            users.splice(users.indexOf(socket.userName), 1);
            socket.broadcast.emit('system', {
                type: 'exit',
                name: socket.userName
            });
        }
        console.log('user disconnected');
    });
});

/**
 * Express configuration.
 */

app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

/**
 * Start Express server.
 */

server.listen(app.get('port'), function () {
    console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;