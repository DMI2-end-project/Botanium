const CLAPEVENT = {
  CLAP_SCORE: "clapScore",
  CLAP_READY: "clapReady",
  CLAP_LAUNCH: "clapLaunch",
};

export default class ClapGameManager {
  constructor(io, socket) {
    this.initListenners(io, socket);
  }

  initListenners(io, socket) {
    socket.on(CLAPEVENT.CLAP_SCORE, (arg) => {
      console.log("CLAPEVENT.CLAP_SCORE", arg);
      io.in(arg.roomId).emit(CLAPEVENT.CLAP_SCORE, arg.clapScore);
    });

    socket.on(CLAPEVENT.CLAP_READY, (arg) => {
      console.log("CLAPEVENT.CLAP_READY", arg);
      io.in(arg.roomId).emit(CLAPEVENT.CLAP_READY, arg.microIsActive);
    });

    socket.on(CLAPEVENT.CLAP_LAUNCH, (arg) => {
      console.log("CLAPEVENT.CLAP_LAUNCH", arg);
      io.in(arg.roomId).emit(CLAPEVENT.CLAP_LAUNCH, arg);
    });
  }
}
