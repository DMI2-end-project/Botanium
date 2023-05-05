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
    this.totalTeams = 0;
    this.totalTeamsReady = 0;
    this.totalTeamsWithMicro = 0;
  }

  initListenners(io, socket) {
      socket.on(CLAPEVENT.CLAP_SCORE, (arg) => {
        console.log("CLAPEVENT.CLAP_SCORE", arg);
        io.in(arg.roomId).emit(CLAPEVENT.CLAP_SCORE, arg.clapScore);
      });

    socket.on(CLAPEVENT.CLAP_READY, (arg) => {
        this.totalTeamsReady += 1;
        this.totalTeamsWithMicro += arg.microIsActive ? 1 : 0;
        if (
          this.totalTeamsWithMicro === 0 &&
          this.totalTeamsReady >= this.totalTeams
        ) {
          io.in(arg.roomId).emit(CLAPEVENT.CLAP_LAUNCH, false);
        } else if (this.totalTeamsReady >= this.totalTeams) {
          io.in(arg.roomId).emit(CLAPEVENT.CLAP_LAUNCH, true);
        }
        io.in(arg.roomId).emit(CLAPEVENT.CLAP_READY, arg.microIsActive);
    });

    socket.on(CLAPEVENT.CLAP_SYNCHRO, (arg, callback) => {
      callback(Date.now());
    });
  }

  setTotalTeams(number) {
    this.totalTeams = number;
    // setInterval(() => {
    //   console.log(Math.floor(Date.now() / 100));
    // }, 100);
  }

  reset() {
    this.totalTeams = 0;
    this.totalTeamsReady = 0;
    this.totalTeamsWithMicro = 0;
  }
}

export const ClapGameManagerInstance = ClapGameManager.Instance;
