import express from "express";
import {createServer} from "http";
import {Server} from "socket.io";

const ROLE = {
  TEACHER: 'teacher',
  STUDENT: 'student',
  PARENT: 'parent'
};

const EVENT = {
  LAUNCH_STORY: 'LaunchStory',
  SEND_INSTRUCTION: 'SendInstruction',
  START_GAME: 'StartGame',
  TEAM_VALIDATION: 'TeamValidation',
  GAME_VALIDATION: 'GameValidation',
  END_GAME: 'EndGame',
  BACK_STORY: 'BackStory',
  END_STORY: 'EndStory',
};

const port = 8080;
const app = express();
const http = createServer(app);
const io = new Server(http, {
  cors: {
    origins: [`http://localhost:${port}`]
  }
});

http.listen(port, () => {
  console.log(`Server listening on *:${port}`);
});

let users = 0;
let gamemaster = undefined;
let gamers = [];

io.on('connection', (socket) => {
  users += 1;
  console.log('a user connected', 'total users connected :', users);

  socket.on('join', (arg) => {
    // Join room
    const joinRoom = () => {
      socket.join(arg.roomId);
      io.to(arg.roomId).emit("join");
    }

    // Set roles
    if (arg.role === ROLE.TEACHER) {
      gamemaster = socket.id;
      joinRoom()
    } else if (arg.role === ROLE.STUDENT) {
      if (!gamers.find(id => id === socket.id)) {
        gamers.push(socket.id)
      }
      joinRoom()
    }

    console.log("users status", gamemaster, gamers);
  })

  socket.on('disconnect', () => {
    users -= 1;
    console.log('user disconnected', 'total users connected :', users);

    if (socket.id === gamemaster) {
      gamemaster = undefined;
    } else {
      let index = gamers.indexOf(socket.id);
      if (index) {
        gamers.splice(index, 1);
      }
    }

    console.log("users status", gamemaster, gamers)
  });

  socket.on(EVENT.LAUNCH_STORY, (arg) => {
    io.to(arg).emit(EVENT.LAUNCH_STORY)
  });

  socket.on(EVENT.START_GAME, (arg) => {
    io.to(arg).emit(EVENT.START_GAME)
  });

  // TODO : chaque client gère sa propre validation -> listen to validation, checker la validation de chaque client
  // TODO : endGame dispatchEvent
});
