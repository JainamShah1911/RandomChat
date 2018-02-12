var app = require('http').createServer(handler),
    io = require('socket.io').listen(app),
    fs = require('fs');
    
app.listen(process.env.PORT || 9000);

function handler(req, res){
    fs.readFile(__dirname + '/public/index.html',
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }
            res.writeHead(200);
            data = data.toString('utf-8').replace('<%=host%>', req.headers.host);
            res.end(data);
        }
    );
};

// socket.io 
io.configure(function(){
    io.set('transports', ['xhr-polling']);
    io.set('polling duration', 60*30);
    io.set('log level', 2);
    io.set('origins', '*:*'); 
});

var socketRoom = {};

io.sockets.on('connection', function(socket){
    
    socket.emit('connected');

    // this function will create rooms for chat which can only have 2 person at a time chatting
    socket.on('requestRandomChat', function(data){
 
        var rooms = io.sockets.manager.rooms;
        for (var key in rooms){
        	console.log(rooms,key);
            if (key == ''){
                continue;
            }

            if (rooms[key].length == 1){
                var roomKey = key.replace('/', '');
                socket.join(roomKey);
                io.sockets.in(roomKey).emit('completeMatch', { });
                socketRoom[socket.id] = roomKey;
                return;
            }
        }
        
        socket.join(socket.id);
        socketRoom[socket.id] = socket.id;
    });
    

    //once requested to join a room can cancel the request
    socket.on('cancelRequest', function(data){
        socket.leave(socketRoom[socket.id]);
    });
    

    //emits recieive message when called by send method
    socket.on('sendMessage', function(data){
        console.log('sendMessage!');
        io.sockets.in(socketRoom[socket.id]).emit('receiveMessage', data);
    });
    

    // this function is called when we disconnect with a client and its key is removed from the room
    socket.on('disconnect', function(data){
        var key = socketRoom[socket.id];
        socket.leave(key);
        io.sockets.in(key).emit('disconnect');
        var clients = io.sockets.clients(key);
        for (var i = 0; i < clients.length; i++){
            clients[i].leave(key);
        }
    });
});