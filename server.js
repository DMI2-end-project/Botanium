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
  LAUNCH_GAME: 'LaunchGame',
  SEND_INSTRUCTION: 'SendInstruction',
  START_GAME: 'StartGame',
  TEAM_VALIDATION: 'TeamValidation',
  GAME_VALIDATION: 'GameValidation',
  END_GAME: 'EndGame',
  BACK_STORY: 'BackStory',
  END_STORY: 'EndStory',
};

const shuffle = (array) => {
  console.log('before shuffle', array)
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  console.log('after shuffle', array)
  return array;
}

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
      if (!gamers.find(gamer => gamer.id === socket.id)) {
        gamers.push({
          id: socket.id
        })
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
    io.to(arg.roomId).emit(EVENT.LAUNCH_STORY, {
      chapterId: arg.chapterId
    })
  });

  socket.on(EVENT.LAUNCH_GAME, (arg) => {
    let gamers = shuffle(gamers);

    gamers.map((gamer, index) => {
      console.log('EVENT.LAUNCH_GAME', gamer, index);
      io.sockets.socket(gamer.id).emit(EVENT.LAUNCH_GAME, {
        gameId: arg.gameId,
        teamId: index,
        totalTeams: gamers.length
      })
    })

    /*
    io.to(arg.roomId).emit(EVENT.LAUNCH_GAME, {
      gameId: arg.gameId,
      teamId: 0,
    })
     */
  });

  socket.on(EVENT.START_GAME, (arg) => {
    io.to(arg.roomId).emit(EVENT.START_GAME)
  });

  socket.on(EVENT.TEAM_VALIDATION, (arg) => {
    io.to(arg.roomId).emit(EVENT.TEAM_VALIDATION, {
      teamId: arg.teamId
    })
  })

  socket.on(EVENT.GAME_VALIDATION, (arg) => {
    io.to(arg.roomId).emit(EVENT.GAME_VALIDATION)
  })

});
