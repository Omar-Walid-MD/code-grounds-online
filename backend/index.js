const express = require("express");
const cors = require("cors");
const http = require("http");
const {Server} = require("socket.io");
const uuid4 = require("uuid").v4;

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server,{
  cors: {
    origin: "*",
    methods: ["GET","POST"]
  }
}
);

server.listen(8000,()=>{
  console.log("Server is listening on port: 8000");
});




let rooms = [];
let users = {};



io.on("connection",(socket)=>{

  //LOGIN
  socket.on("login",(user)=>{
    users[socket.id] = user;
  })


  //DISCONNECT
  socket.on("disconnect",(reason)=>{
    const user = users[socket.id];
    let roomToleaveId = null;
    if(user)
    {
      rooms.forEach((room)=>{

        if(room.users.find((u) => u.userId === user.userId)) roomToleaveId = room.id;
        room.users = room.users.filter((u) => u.userId !== user.userId);
      });
      delete users[socket.id];

      rooms = rooms.filter((r) => r.users.length);
    }
    const room = rooms.find(r => r.id === roomToleaveId);
    socket.leave("leaving room");
    io.to(roomToleaveId).emit("get_room",room);
  });
  
  //JOIN ROOM
  socket.on("join_room",(data)=>{
    let roomToJoin = rooms.find((room) => room.gameMode === data.gameMode && room.state === "waiting");
    if(roomToJoin)
    {
      roomToJoin.users.push(data.user);
    }
    else
    {
      roomToJoin = {
        gameMode: data.gameMode,
        id: uuid4(),
        users: [data.user],
        state: "waiting",
        startTime: null
      };
      rooms.push(roomToJoin)
    }

    socket.join(roomToJoin.id);
    io.to(roomToJoin.id).emit("get_room",roomToJoin);
  });

  //UPDATE ROOM
  socket.on("update_room",(data)=>{
    rooms = rooms.map((r) => r.id === data.roomId ? {...r,...data.update} : r);
    io.to(data.roomId).emit("get_room",rooms.find((r) => r.id === data.roomId));

  });

  //UPDATE USER IN ROOM
  socket.on("update_user_in_room",(data)=>{
    const room = rooms.find((r) => r.id === data.roomId);
    if(room)
    {
      room.users = room.users.map((u) => u.userId === data.userId ? data.updatedUser : u);
      io.to(data.roomId).emit("get_room",room);
    }

  });

  //EXIT ROOM
  socket.on("exit_room",(data)=>{
    let room = rooms.find((r) => r.id === data.roomId);
    if(room)
    {
      room.users = room.users.filter((u) => u.userId !== data.userId);
      rooms = rooms.filter((r) => r.users.length);
    }
    room = rooms.find((r) => r.id === data.roomId);
    console.log("exiting room");
    io.to(data.roomId).emit("get_room",room);

  })

});

