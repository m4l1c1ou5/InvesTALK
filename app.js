const express=require('express');
const path=require('path');
const http=require('http');
const socketio=require('socket.io');
const g=require("./utils/message.js")

const app=express();

const server=http.createServer(app);

const io=socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log('Sent Welcome Message');
    socket.on('join',(k)=>{
        socket.join(k.hashtag);
        socket.emit('message',g.generateMessage("Welcome Aboard!","Admin"));
        socket.broadcast.to(k.hashtag).emit('message',g.generateMessage(`${k.name} is connected`,"Admin"));
    })
    socket.on('new_msg',(msg,k,callback)=>{
        io.to(k.hashtag).emit('message',g.generateMessage(msg,k.name));
        callback();
    })
    socket.on('disconnect',()=>{
        socket.broadcast.emit('message',g.generateMessage("a user is disconnected"));  
    })
    socket.on('share-location',(lat,long,k,callback)=>{
        io.to(k.hashtag).emit('share-location',g.generateMessage("https://google.com/maps?q="+lat+","+long,k.name));
        callback();
    })
})


server.listen(3000 || process.env.PORT,()=>{
    console.log("Listening on port 3000");
})
