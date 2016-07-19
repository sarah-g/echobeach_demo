/*
Bat recorder project

Sarah Gallacher
21/04/2016
*/

var serveIndex = require('serve-index');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');

var cp = require('child_process');
var child = cp.fork('./hardware/recorder.js');

child.on('message', function(m){
    console.log("from child: "+m);
    
    if(m == 'listening'){
        io.sockets.emit(m);
    }else if(m == 'spectrogram'){
        io.sockets.emit(m);
    }else{
        fs.readFile(m, function(err, buf){
            //io.sockets.emit('image', { image: true, buffer: buf.toString('base64') });
            var filename = m.slice(13); //remove base: /media/sdcard/
            io.sockets.emit('image', {filename: filename});
        });
    }
});

app.use('/', express.static(__dirname + '/public'));
app.use('/recordings', express.static('/media/sdcard/recordings'));
app.use('/recordings', serveIndex('/media/sdcard/recordings'));

io.on('connection', function(socket){
  console.log('a user connected');
});

http.listen(process.env.PORT || 3000, function(){
    console.log("Http server listening on port 3000");
});


//start recorder
//recorder.start();
