import express from "express";
import {createServer} from "http";
import {Server} from "socket.io";

const ROLE = {
  TEACHER: 'teacher',
  STUDENT: 'student',
  PARENT: 'parent'
};

const EVENT = {
  TOTAL_TEAMS: 'TotalTeams',
  LAUNCH_STORY: 'LaunchStory',
  LAUNCH_GAME: 'LaunchGame',
  START_GAME: 'StartGame',
  TEAM_VALIDATION: 'TeamValidation',
  GAME_VALIDATION: 'GameValidation',
  END_GAME: 'EndGame',
  BACK_STORY: 'BackStory',
  END_STORY: 'EndStory',
};

let users = 0;
let rooms = [];

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


/*  METHODS  */
const shuffle = (array) => {
  console.log('before shuffle', array)
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  console.log('after shuffle', array)
  return array;
}


/*  SOCKET  */
io.on('connection', (socket) => {
  users += 1;
  console.log('a user connected', 'total users connected :', users);

  socket.on('join', (arg) => {
    console.log('join', arg)

    // Join room
    socket.join(arg.roomId);
    io.to(arg.roomId).emit("join");

    let gamemaster = undefined;
    let gamers = [];

    if (arg.role && arg.role === ROLE.TEACHER) {
      gamemaster = socket.id
    } else if (arg.role && arg.role === ROLE.STUDENT) {
      gamers.push(socket.id)
    }

    // Set roles
    let index = rooms.findIndex(room => room.id === arg.roomId);
    if (index < 0) {
      rooms.push({
        id: arg.roomId,
        gamemaster,
        gamers,
      })
    } else {
      if (rooms[index] && !rooms[index].gamers.find(gamer => gamer === socket.id)) {
        rooms[index].gamers.push(socket.id)
      }
    }

    io.to(arg.roomId).emit(EVENT.TOTAL_TEAMS, {
      totalTeams: rooms[index >= 0 ? index : rooms.length - 1].gamers.length
    })
  })

  socket.on('disconnect', () => {
    users -= 1;
    console.log('user disconnected', 'total users connected :', users);

    // TODO remove of room
    // TODO remove empty rooms
    //if (socket.id === gamemaster) {
    //  gamemaster = undefined;
    //} else {
    //  let index = gamers.indexOf(socket.id);
    //  if (index) {
    //    gamers.splice(index, 1);
    //  }
    //}
  });

  socket.on(EVENT.LAUNCH_STORY, (arg) => {
    io.to(arg.roomId).emit(EVENT.LAUNCH_STORY, {
      chapterId: arg.chapterId
    });
  });

  socket.on(EVENT.LAUNCH_GAME, (arg) => {
    let room = rooms.find(room => room.id === arg.roomId);

    if (room) {
      let gamers = shuffle(room.gamers);

      gamers.map((gamer, index) => {
        console.log('EVENT.LAUNCH_GAME', gamer, index);
        io.to(gamer).emit(EVENT.LAUNCH_GAME, {
          gameId: arg.gameId,
          teamId: index,
          totalTeams: gamers.length
        });
      });
    }

    /*
    io.to(arg.roomId).emit(EVENT.LAUNCH_GAME, {
      gameId: arg.gameId,
      teamId: 0,
    })
     */
  });

  socket.on(EVENT.START_GAME, (arg) => {
    console.log('EVENT.START_GAME', arg)
    io.to(arg.roomId).emit(EVENT.START_GAME)
  });

  socket.on(EVENT.TEAM_VALIDATION, (arg) => {
    io.to(arg.roomId).emit(EVENT.TEAM_VALIDATION, {
      teamId: arg.teamId
    });
  });

  socket.on(EVENT.GAME_VALIDATION, (arg) => {
    io.in(arg.roomId).emit(EVENT.GAME_VALIDATION)
  });

});
