import express from "express";
import {createServer} from "http";
import {Server} from "socket.io";
import {ClapGameManagerInstance} from "./server/clapGameManager.js";
import {Room} from "./server/Room.js";
import {CHAPTER_STEP, EVENT, GAME_STEP, ROLE} from "./server/constants.js";

const port = 8080;
const app = express();
const http = createServer(app);
const io = new Server(http, {
  cors: {
    origins: [`http://localhost:${port}`]
    //origins: [`http://172.28.59.22:${port}`]
  }
});

http.listen(port, () => {
  console.log(`Server listening on *:${port}`);
});

let rooms = [];

/*  METHODS  */

const joinRoom = (socket, arg) => {

  let room;
  let roomIndex = rooms.findIndex(room => room.id === arg.roomId);

  // Is room already set ?
  if (roomIndex === -1) {
    room = new Room(arg.roomId);
    rooms.push(room);
  } else {
    room = rooms[roomIndex];
  }

  // Affect role & push room
  if (arg.role === ROLE.TEACHER) {
    room.gamemaster = socket.id;
  } else if (arg.role === ROLE.STUDENT) {
    room.addTeam(socket.id, arg.teamName);
  }

  io.to(socket.id).emit(EVENT.ROOM_STATUS, room);
  //  io.sockets.adapter.rooms.get(arg.roomId)
}

const cleanRoom = (socket) => {
  let roomToRemove;
  rooms.map((room) => {
    // Remove user from room
    if (room.gamemaster === socket.id) {
      room.gamemaster = undefined;
    } else {
      room.removeTeam(socket.id);
    }

    // Remove empty rooms
    let hasToBeRemoved = true
    room.teams.map(t => {
      if (t.isConnected) {
        hasToBeRemoved = false;
      }
    })

    if (!room.gamemaster && hasToBeRemoved) {
      roomToRemove = room.id;
    }

    return room;
  })

  if (roomToRemove) {
    rooms = rooms.filter(room => room.id !== roomToRemove);
  }
}


/*  SOCKET  */
io.on('connection', (socket) => {
  //console.log('a user connected :', socket.id);

  socket.on('join', (arg) => {
    //console.log('join', arg);
    if (arg.roomId) {
      socket.join(arg.roomId);
      joinRoom(socket, arg);
    }
  })

  socket.on('disconnect', () => {
    //console.log('a user disconnected', socket.id);

    cleanRoom(socket);
  });

  socket.on(EVENT.LAUNCH_CHAPTER, (arg) => {
    console.log('EVENT.LAUNCH_CHAPTER', arg);
    let room = rooms.find(room => room.id === arg.roomId);

    if (room) {
      room.chapterId = arg.chapterId;
      room.chapterStep = CHAPTER_STEP.INTRODUCTION;

      io.in(arg.roomId).emit(EVENT.TOTAL_TEAMS, {
        totalTeams: room.teams
      });
      io.to(arg.roomId).emit(EVENT.LAUNCH_CHAPTER, {
        chapterId: arg.chapterId
      });

      io.in(arg.roomId).emit(EVENT.ROOM_STATUS, room);
    }
  });

  socket.on(EVENT.START_CHAPTER, (arg) => {
    console.log('EVENT.START_CHAPTER', arg)
    let room = rooms.find(room => room.id === arg.roomId);

    if (room) {
      room.chapterStep = CHAPTER_STEP.STORY;

      room.connectedTeams.map((team, index) => {
        team.teamId = index;

        io.to(team.socketId).emit(EVENT.START_CHAPTER, {
          teamId: index,
          teamName: team.name
        });
        console.log('team', team, index);
      });

      io.in(arg.roomId).emit(EVENT.ROOM_STATUS, room);
    }
  });

  socket.on(EVENT.LAUNCH_GAME, (arg) => {
    console.log('EVENT.LAUNCH_GAME', arg);

    let room = rooms.find(room => room.id === arg.roomId);

    if (room) {
      room.chapterStep = CHAPTER_STEP.IDLE;
      room.gameStep = GAME_STEP.INSTRUCTION;

      room.gameId = arg.gameId;

      io.in(arg.roomId).emit(EVENT.LAUNCH_GAME, {
        gameId: arg.gameId
      });

      room.gameId = arg.gameId

      io.in(arg.roomId).emit(EVENT.ROOM_STATUS, room);
    }
  });

  socket.on(EVENT.START_GAME, (arg) => {
    console.log('EVENT.START_GAME', arg)

    let room = rooms.find(room => room.id === arg.roomId);

    if (room) {
      room.shuffleTeams();

      room.teams.map(team => {
        console.log('START', team.isConnected)
        if (team.isConnected) {
          team.isPlaying = team.isConnected;
        } else {
          team.teamId = undefined;
        }
      });

      room.gameStep = GAME_STEP.PLAY;

      ClapGameManagerInstance.reset();
      ClapGameManagerInstance.setTotalTeams(room.playingTeams.length);

      io.to(room.gamemaster).emit(EVENT.TOTAL_TEAMS, {
        totalTeams: room.playingTeams
      })

      room.playingTeams.map((team, index) => {
        console.log('playing teams', team, team.socketId, index, team.name);
        team.teamId = index;
        io.to(team.socketId).emit(EVENT.START_GAME, {
          //gameId: arg.gameId,
          teamId: index,
          teamName: team.name,
          totalTeams: room.playingTeams
        });
      });

      io.in(arg.roomId).emit(EVENT.ROOM_STATUS, room);
    }
  });

  socket.on(EVENT.TEAM_VALIDATION, (arg) => {
    console.log('EVENT.TEAM_VALIDATION', arg);
    io.to(arg.roomId).emit(EVENT.TEAM_VALIDATION, {
      teamId: arg.teamId,
    });

    let room = rooms.find(room => room.id === arg.roomId);
    if (room) {

      let team = room.teams.find(team => team.teamId === arg.teamId);

      if (team) {
        team.isValidated = true;
      }

      if (room.isGameFinished()) {
        console.log('EMIT PLS')
        io.in(arg.roomId).emit(EVENT.GAME_VALIDATION);
        room.gameStep = GAME_STEP.END;
      }

      io.in(arg.roomId).emit(EVENT.ROOM_STATUS, room);
    }
  });

  socket.on(EVENT.END_GAME, (arg) => {
    console.log('EVENT.END_GAME', arg);

    io.in(arg.roomId).emit(EVENT.END_GAME);

    let room = rooms.find(room => room.id === arg.roomId);

    if (room) {
      room.gameStep = GAME_STEP.CONGRATS;

      io.in(arg.roomId).emit(EVENT.ROOM_STATUS, room);
    }
  })

  socket.on(EVENT.BACK_CHAPTER, (arg) => {
    console.log('EVENT.BACK_CHAPTER', arg)

    io.in(arg.roomId).emit(EVENT.BACK_CHAPTER, {
      gameId: arg.gameId,
    });

    let room = rooms.find(room => room.id === arg.roomId);
    if (room) {
      room.gameStep = GAME_STEP.IDLE;
      room.chapterStep = CHAPTER_STEP.STORY;

      io.in(arg.roomId).emit(EVENT.ROOM_STATUS, room);
    }
  });

  socket.on(EVENT.END_CHAPTER, (arg) => {
    console.log('EVENT.END_CHAPTER', arg);

    io.to(arg.roomId).emit(EVENT.END_CHAPTER);

    let room = rooms.find(room => room.id === arg.roomId);
    if (room) {
      room.chapterStep = CHAPTER_STEP.END;

      io.in(arg.roomId).emit(EVENT.ROOM_STATUS, room);
    }
  });

  ClapGameManagerInstance.initListenners(io, socket);
});
