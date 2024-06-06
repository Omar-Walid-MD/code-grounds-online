const http = require("http");
const {WebSocketServer} = require("ws");
const url = require("url");
const { generateAvatar } = require("../src/Helpers/avatar");
const uuid4 = require("uuid").v4;

const server = http.createServer();
const webServer = new WebSocketServer({server});
const port = 8080;

const connections = {};
let rooms = [];
let users = [];

function handleMessage(bytes,uuid)
{
    // message: {
    //     type: "room" || "user",
    //     id: "id",
    //     update: {
    //      "property": "data"
    //    }
    // }
    const message = JSON.parse(bytes.toString());


    if(message.type)
    {
        if(message.type === "user")
        {
            rooms[0].users = rooms[0].users.map(u => u.userId === message.id ? {...u,...message.update} : u);
    
        }
        else if(message.type === "room")
        {
            rooms = rooms.map(r => r.roomId === message.id ? {...r,...message.update} : r);
        }
    }

    console.log(rooms[0].users[0]);
    broadcast();
}

function handleClose(uuid)
{
    delete connections[uuid];
    users = users.filter((u) => u.userId !== uuid);

    rooms.forEach((room)=>{
        room.users = room.users.filter((u) => u.userId !== uuid);
    })

    rooms = rooms.filter((room) => room.users.length);

    broadcast();
}

function broadcast()
{
    Object.keys(connections).forEach((uuid)=>{
        const connection = connections[uuid];
        const message = JSON.stringify({
            rooms, users
        });
        connection.send(message);
    })
}

webServer.on("connection",(connection,request)=>{

    const {gameMode,userId} = url.parse(request.url,true).query;

    
    connections[userId] = connection;
    newUser = {
        userId,
        username: "Guest-"+userId,
        avatar: generateAvatar()
    }

    if(!Object.keys(users).length)
    {
        const roomId = uuid4();
        rooms.push({roomId,gameMode,state:"waiting",startTime:null,users:[newUser]});
    }
    else
    {
        rooms[0].users.push(newUser);
    }

    users.push(newUser);

    

    console.log(`(${userId})`);

    connection.on("message",(message) => handleMessage(message,userId));
    connection.on("close",() => handleClose(userId));
});

server.listen(port,()=>{
    console.log(`listening on port: ${port}`)
});

