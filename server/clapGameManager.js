const CLAPEVENT = {
  CLAP_SCORE: "clapScore",
  CLAP_READY: "clapReady",
  CLAP_LAUNCH: "clapLaunch",
  CLAP_SYNCHRO: "clapSynchro",
};

class ClapGameManager {
  static _instance;

  static get Instance() {
    return this._instance || (this._instance = new this());
  }

  constructor() {
    if (ClapGameManager.exists) {
      return ClapGameManager.instance;
    }
    this.rooms = []
  }

  initListenners(io, socket) {
    socket.on(CLAPEVENT.CLAP_SCORE, (arg) => {
      console.log("CLAPEVENT.CLAP_SCORE", arg);
      io.in(arg.roomId).emit(CLAPEVENT.CLAP_SCORE, arg.clapScore);
    });

    socket.on(CLAPEVENT.CLAP_READY, (arg) => {
      console.log("CLAPEVENT.CLAP_READY", arg);
      let room = this.rooms.find((room) => room.id === arg.roomId);
      if (room) {
        let team = room.teams.find((team) => team.teamId === arg.teamId);

        if (team) {
          team.hasMicro = arg.hasMicro;
        }

        const isReady = room.isClapReady();


        if (isReady !== null) {
          io.in(arg.roomId).emit(CLAPEVENT.CLAP_LAUNCH, isReady);
        }

        io.in(arg.roomId).emit(CLAPEVENT.CLAP_READY, room);
      }
    });

    socket.on(CLAPEVENT.CLAP_SYNCHRO, (arg, callback) => {
      callback(Date.now());
    });
  }

  updateRooms(rooms) {
    this.rooms = rooms;
  }
}

export const ClapGameManagerInstance = ClapGameManager.Instance;
