import express from "express";
import {createServer} from "http";
import {Server} from "socket.io";

const ROLE = {
  TEACHER: 'teacher',
  STUDENT: 'student',
  PARENT: 'parent'
};

const EVENT = {
  ROOM_STATUS: 'RoomStatus',
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

/*
interface RoomData {
  id: string,
  isPlaying: boolean,
  gamemaster: string,
  teams: string[],
  teamsValidation: boolean[],
  chapterId: number,
  gameId: number,
  step: number
}*/

let rooms = [];
//let currentStep = ;
// TODO : save currentStep

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

  let roomIndex = rooms.findIndex(room => room.id === arg.roomId);
  let room;
  // Is room already set ?
  if (roomIndex === -1) {
    // Affect role & push room
    if (arg.role === ROLE.TEACHER) {
      rooms.push({
        id: arg.roomId,
        isPlaying: false,
        gamemaster: socket.id,
        teams: [],
      })
    } else if (arg.role === ROLE.STUDENT) {
      rooms.push({
        id: arg.roomId,
        isPlaying: false,
        gamemaster: undefined,
        teams: [socket.id]
        //teams: [{
        //  id: socket.id,
        //  isConnected: true,
        //  isPlaying: false
        //}],
      })
    }
  } else {
    let room = rooms[roomIndex];
    if (arg.role === ROLE.TEACHER) {
      room.gamemaster = socket.id;
    } else if (arg.role === ROLE.STUDENT) {
      if (!room.teams.find(t => t === socket.id)) {
        room.teams.push(socket.id);
      }
      /*
      let teamIndex = room.teams.findIndex(t => t.id === socket.id);
      if (teamIndex === -1) {
        //room.teams.push({
        //  id: socket.id,
        //  isConnected: true,
        //  isPlaying: false
        //});
        room.teams.push(socket.id)
      } else {
        room.teams[teamIndex].isConnected = true;
      }
       */

    }
  }

  let i = roomIndex >= 0 ? roomIndex : rooms.length - 1;

  //io.in(arg.roomId).emit(EVENT.TOTAL_TEAMS, {
  //  totalTeams: rooms[i].teams ? rooms[i].teams : undefined
  //})

  io.to(socket.id).emit(EVENT.ROOM_STATUS, {
    //roomStatus: rooms[i]
    chapterId: rooms[i].chapterId,
    gameId: rooms[i].gameId,
    isPlaying: rooms[i].isPlaying,
    step: rooms[i].step,
    teamsValidation: rooms[i].teamsValidation
  })

  console.log('rooms', rooms);//  io.sockets.adapter.rooms.get(arg.roomId)
}

const cleanRoom = (socket) => {
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

const leaveRoom = (socket) => {
  let roomToRemove;
  rooms.map((room, index) => {
    // Change status of team in room
    if (room.gamemaster === socket.id) {
      room.gamemaster = undefined
    } else {
      room.teams = room.teams.map(team => {
        if (team.id === socket.id) {
          team.isConnected = false
        }
      });
    }
    return room;
  })


  //console.log('rooms', rooms);
}

const reachStep = () => {
  // TODO : reconnect to the game if is not finished
}


/*  SOCKET  */
io.on('connection', (socket) => {
  console.log('a user connected :', socket.id);

  socket.on('join', (arg) => {
    console.log('join', arg);

    if (arg.roomId) {
      socket.join(arg.roomId);
      io.to(arg.roomId).emit("join");
      joinRoom(socket, arg);
      reachStep();
    }
  })

  socket.on('disconnect', () => {
    console.log('a user disconnected', socket.id);

    //leaveRoom(socket);
    cleanRoom(socket);
  });

  socket.on(EVENT.LAUNCH_STORY, (arg) => {
    console.log('EVENT.LAUNCH_STORY', arg);
    let room = rooms.find(room => room.id === arg.roomId);

    if (room) {
      io.in(arg.roomId).emit(EVENT.TOTAL_TEAMS, {
        totalTeams: room.teams
      });
      io.to(arg.roomId).emit(EVENT.LAUNCH_STORY, {
        chapterId: arg.chapterId
      });
      room.chapterId = arg.chapterId;
    }
  });

  socket.on(EVENT.LAUNCH_GAME, (arg) => {
    console.log('EVENT.LAUNCH_GAME', arg);

    let room = rooms.find(room => room.id === arg.roomId);
    if (room) {
      io.in(arg.roomId).emit(EVENT.TOTAL_TEAMS, {
        totalTeams: room.teams
      });

      room.teams.map((team, index) => {
        io.to(team).emit(EVENT.LAUNCH_GAME, {
          gameId: arg.gameId,
          teamId: index,
          //totalTeams: teams
        });
      });

      room.gameId = arg.gameId
    }
  });

  socket.on(EVENT.START_GAME, (arg) => {
    console.log('EVENT.START_GAME', arg)

    io.to(arg.roomId).emit(EVENT.START_GAME);

    let room = rooms.find(room => room.id === arg.roomId);
    if (room) {
      io.in(arg.roomId).emit(EVENT.TOTAL_TEAMS, {
        totalTeams: room.teams
      });

      room.isPlaying = true;
      room.step = arg.step;
      room.teamsValidation = []

      for(let i = 0; i < room.teams.length; i++) {
        room.teamsValidation.push(false)
      }
    }
  });

  socket.on(EVENT.TOTAL_TEAMS, (arg) => {
    let room = rooms.find(room => room.id === arg.roomId);
    console.log('EVENT.TOTAL_TEAMS', arg.roomId, room, room.teams);
    //io.in(arg.roomId).emit(EVENT.TOTAL_TEAMS, {
    //  totalTeams: room.teams
    //})
  });

  socket.on(EVENT.TEAM_VALIDATION, (arg) => {
    console.log('EVENT.TEAM_VALIDATION', arg);
    io.to(arg.roomId).emit(EVENT.TEAM_VALIDATION, {
      teamId: arg.teamId,
    });

    rooms.map((room) => {
      if (room.id === arg.roomId) {
        room.teamsValidation[arg.teamId] = true;
      }
    });
  });

  socket.on(EVENT.GAME_VALIDATION, (arg) => {
    console.log('EVENT.GAME_VALIDATION', arg)
    io.in(arg.roomId).emit(EVENT.GAME_VALIDATION)
    rooms.map((room) => {
      if (room.id === arg.roomId) {
        room.isPlaying = false;
        room.step = arg.step;
      }
    });
  });

  socket.on(EVENT.END_GAME, (arg) => {
    console.log('EVENT.END_GAME', arg)
    io.in(arg.roomId).emit(EVENT.END_GAME)
    rooms.map((room) => {
      if (room.id === arg.roomId) {
        room.step = arg.step;
      }
    });
  })

  socket.on(EVENT.BACK_STORY, (arg) => {
    console.log('EVENT.BACK_STORY', arg)
    io.in(arg.roomId).emit(EVENT.GAME_VALIDATION, {
      gameId: arg.gameId
    })
  });

  socket.on(EVENT.END_STORY, (arg) => {
    console.log('EVENT.END_STORY', arg)
    io.in(arg.roomId).emit(EVENT.END_STORY, {})
  });
});
