const CLAPEVENT = {
  CLAP_SCORE: "clapScore",
  CLAP_READY: "clapReady",
  CLAP_LAUNCH: "clapLaunch",
  CLAP_SYNCHRO: 'clapSynchro',
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
    this.teams = 0;
    this.teamsReady = 0;
    this.teamsWithMicro = 0;
  }

  initListenners(io, socket) {
      socket.on(CLAPEVENT.CLAP_SCORE, (arg) => {
        console.log("CLAPEVENT.CLAP_SCORE", arg);
        io.in(arg.roomId).emit(CLAPEVENT.CLAP_SCORE, arg.clapScore);
      });

    socket.on(CLAPEVENT.CLAP_READY, (arg) => {
        this.teamsReady += 1;
        this.teamsWithMicro += arg.microIsActive ? 1 : 0;
        if (
          this.teamsWithMicro === 0 &&
          this.teamsReady >= this.teams
        ) {
          io.in(arg.roomId).emit(CLAPEVENT.CLAP_LAUNCH, false);
        } else if (this.teamsReady >= this.teams) {
          io.in(arg.roomId).emit(CLAPEVENT.CLAP_LAUNCH, true);
        }
        io.in(arg.roomId).emit(CLAPEVENT.CLAP_READY, arg.microIsActive);
    });

    socket.on(CLAPEVENT.CLAP_SYNCHRO, (arg, callback) => {
      callback(Date.now());
    });
  }

  setTeams(number) {
    this.teams = number;
    // setInterval(() => {
    //   console.log(Math.floor(Date.now() / 100));
    // }, 100);
  }

  reset() {
    this.teams = 0;
    this.teamsReady = 0;
    this.teamsWithMicro = 0;
  }
}

export const ClapGameManagerInstance = ClapGameManager.Instance;
