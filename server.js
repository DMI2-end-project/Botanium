import express from "express";
import {createServer} from "http";
import { Server } from "socket.io";

const app = express();
const http = createServer(app);
const io = new Server(http, {
  cors: {
    origins: ['http://localhost:8080']
  }
});

const port = 8080;
http.listen(port, () => {
  console.log(`Server listening on *:${port}`);
});

let users = 0;

io.on('connection', (socket) => {
  users += 1;
  console.log('a user connected', 'total users connected :', users)

  socket.on('join', (arg) => {
    socket.join(arg);
    io.to(arg).emit("join", `a user joined the room: ${arg}`);
  })

  socket.on('disconnect', () => {
    users -= 1;
    console.log('user disconnected', 'total users connected :', users);
  });
});
