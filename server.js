import express from "express";
import {createServer} from "http";
import { Server } from "socket.io";
import {ClapGameManagerInstance} from "./server/clapGameManager.js";

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

let roomData = {
  id: '',
  gamemaster: '',
  teams: [],
  chapterId: 0,
  gameId: 0
}

let rooms = [];
//let currentStep = ;
// TODO : save currentStep

const port = 8080;
const app = express();
const http = createServer(app);
const io = new Server(http, {
  cors: {
    origins: [`http://localhost:${port}`],
  },
});

http.listen(port, () => {
  console.log(`Server listening on *:${port}`);
});


/*  METHODS  */
const shuffle = (array) => {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}

const joinRoom = (socket, arg) => {

  let index = rooms.findIndex(room => room.id === arg.roomId);
  // Is room already set ?
  if (index === -1) {
    // Affect role & push room
    if (arg.role === ROLE.TEACHER) {
      rooms.push({
        id: arg.roomId,
        gamemaster: socket.id,
        teams: []
      })
    } else if (arg.role === ROLE.STUDENT) {
      rooms.push({
        id: arg.roomId,
        gamemaster: undefined,
        teams: [socket.id],
      })
    }
  } else {
    if (arg.role === ROLE.TEACHER) {
      rooms[index].gamemaster = socket.id;
    } else if (arg.role === ROLE.STUDENT && !rooms[index].teams.find(t => t === socket.id)) {
      rooms[index].teams.push(socket.id);
    }
  }

  let i = index >= 0 ? index : rooms.length - 1;

  io.in(arg.roomId).emit(EVENT.TOTAL_TEAMS, {
    totalTeams: rooms[i].teams ? rooms[i].teams.length : 0
  })

  console.log('rooms', rooms);//  io.sockets.adapter.rooms.get(arg.roomId)
}

const leaveRoom = (socket) => {
  let roomToRemove;
  rooms.map((room, index) => {
    // Remove user from room
    if (room.gamemaster === socket.id) {
      room.gamemaster = undefined
    } else {
      room.teams = room.teams.filter(team => team !== socket.id);
    }

    // Remove empty rooms
    if (!room.gamemaster && room.teams.length === 0) {
      roomToRemove = room.id;
    }

    return room;
  })

  if (roomToRemove) {
    rooms = rooms.filter(room => room.id !== roomToRemove);
  }

  console.log('rooms', rooms);
}

const reachStep = () => {
  // TODO : reconnect to the game if is not finished
}


/*  SOCKET  */
io.on('connection', (socket) => {
  console.log('a user connected :', socket.id);

  socket.on('join', (arg) => {
    console.log('join', arg);
    socket.join(arg.roomId);
    io.to(arg.roomId).emit("join");

    joinRoom(socket, arg);
    reachStep();
  })

  socket.on('disconnect', () => {
    console.log('a user disconnected', socket.id);

    leaveRoom(socket);
  });

  socket.on(EVENT.LAUNCH_STORY, (arg) => {
    console.log('EVENT.LAUNCH_STORY', arg);
    io.to(arg.roomId).emit(EVENT.LAUNCH_STORY, {
      chapterId: arg.chapterId
    });
  });

  socket.on(EVENT.LAUNCH_GAME, (arg) => {
    let room = rooms.find(room => room.id === arg.roomId);

    if (room) {
      room.teams = shuffle(room.teams);
      ClapGameManagerInstance.reset();
      ClapGameManagerInstance.setTotalTeams(room.teams.length);

      room.teams.map((team, index) => {
        console.log('EVENT.LAUNCH_GAME', team, index, room.teams.length, arg.gameId);
        io.to(team).emit(EVENT.LAUNCH_GAME, {
          gameId: arg.gameId,
          teamId: index,
          totalTeams: room.teams.length
        });
      });
    }
  });

  socket.on(EVENT.START_GAME, (arg) => {
    console.log('EVENT.START_GAME', arg)
    io.to(arg.roomId).emit(EVENT.START_GAME);
  });

  socket.on(EVENT.TOTAL_TEAMS, (arg) => {
    let room = rooms.find(room => room.id === arg.roomId);
    console.log('EVENT.TOTAL_TEAMS', arg.roomId, room, room.teams);
    io.in(arg.roomId).emit(EVENT.TOTAL_TEAMS, {
      totalTeams: room.teams.length
    })
  });

  socket.on(EVENT.TEAM_VALIDATION, (arg) => {
    console.log('EVENT.TEAM_VALIDATION', arg);
    io.to(arg.roomId).emit(EVENT.TEAM_VALIDATION, {
      teamId: arg.teamId
    });
  });

  socket.on(EVENT.GAME_VALIDATION, (arg) => {
    console.log('EVENT.GAME_VALIDATION', arg)
    io.in(arg.roomId).emit(EVENT.GAME_VALIDATION)
  });

  socket.on(EVENT.END_GAME, (arg) => {
    console.log('EVENT.END_GAME', arg)
    io.in(arg.roomId).emit(EVENT.END_GAME)
  })

  socket.on(EVENT.BACK_STORY, (arg) => {
    console.log('EVENT.BACK_STORY', arg)
    io.in(arg.roomId).emit(EVENT.GAME_VALIDATION, {
      gameId: arg.gameId
    })
  });

  socket.on(EVENT.END_STORY, (arg) => {
    console.log('EVENT.END_STORY', arg)
    io.in(arg.roomId).emit(EVENT.END_STORY, {
    })
  });

  ClapGameManagerInstance.initListenners(io, socket);
});
