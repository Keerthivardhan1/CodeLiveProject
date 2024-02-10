import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import ACTIONS from './Actions.js'
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static('dist'))
app.use((req ,res , next)=>{
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
})

const userSocketMap = [];

function getAllConnectedClients(teamID) {
  return (Array.from(io.sockets.adapter.rooms.get(teamID)) || []).map((socketID) => {
    return {
      socketID,
      username: userSocketMap.find(user => user.socketID === socketID).username,
    }
  })
}

io.on('connection', (socket) => {
  
  console.log(`New connection : ${socket.id}`);

  socket.on(ACTIONS.CODE_CHANGE , ({teamID , code})=>{
    socket.in(teamID).emit(ACTIONS.CODE_CHANGE , { teamID,code})
  })


  socket.on(ACTIONS.JOIN, ({ teamID, userName }) => {
    console.log(userName ," joined in ",teamID)
    const existingUser = userSocketMap.find(user => user.username === userName);
    if (existingUser) {
      // User with the same username already exists
      // Handle the error or reject the connection
      return;
    }

    userSocketMap.push({ socketID: socket.id, username: userName });
    socket.join(teamID);
    const clients = getAllConnectedClients(teamID);

    
    clients.forEach(({ socketID }) => {
        io.to(socketID).emit(ACTIONS.JOINED, {
          clients,
          userName,
          socketID: socket.id,
        })
      })

    socket.on('disconnecting' , ()=>{
       const teams =  [...socket.rooms]

       teams.forEach((teamID)=>{
        socket.in(teamID).emit(ACTIONS.DISCONNECTED , {
            socketID: socket.id,
            userName : userSocketMap.find(user => { if(user.socketID === socket.id) return user }).username,
        })
       })

       delete userSocketMap[socket.id];
       socket.leave();
    })

  })

  socket.on('look',({teamID,userName})=>{
    console.log("looking came with ", teamID, userName)
    let targetUserName=userSocketMap.find(user => user.username===userName)
    socket.in(teamID).emit('roomLooked', { userName });

  })

  socket.on('send_message', ({teamID, inputMessage}) => {
    console.log('mess',teamID, inputMessage );
    socket.in(teamID).emit('receive_message', inputMessage);
  })
  
})


const PORT = process.env.PORT || 3000
server.listen(PORT, () => { console.log(" server is listening at port:", PORT) })
