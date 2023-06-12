const AUDIO_EVENT = {
  AUDIO_GAME_READY: "audioGameReady",
  AUDIO_SYNCHRO: "audioSynchro",
  MICRO_READY: "microReady",
  CLAP_SCORE: "clapScore",
};

class AudioManager {
  static _instance;

  static get Instance() {
    return this._instance || (this._instance = new this());
  }

  constructor() {
    if (AudioManager.exists) {
      return AudioManager.instance;
    }
    this.rooms = [];
  }

  initListenners(io, socket) {
    socket.on(AUDIO_EVENT.CLAP_SCORE, (arg) => {
      console.log("AUDIO_EVENT.CLAP_SCORE", arg);
      let room = this.rooms.find((room) => room.id === arg.roomId);
      if (room) {
        room.clapGameScore += arg.rhythm * 5 + Math.max(arg.rhythm * 5 / room.microOnTeams.length, 0);
        room.clapGameScore = Math.min(Math.max(room.clapGameScore, 0), 100);
        io.in(arg.roomId).emit(AUDIO_EVENT.CLAP_SCORE, room.clapGameScore);
      }
    });

    socket.on(AUDIO_EVENT.MICRO_READY, (arg) => {
      console.log("AUDIO_EVENT.MICRO_READY", arg);
      let room = this.rooms.find((room) => room.id === arg.roomId);
      if (room) {
        let team = room._teams.find((team) => team._name === arg.teamName);

        if (team) {
          team.hasMicro = arg.hasMicro;
        }

        io.in(arg.roomId).emit(AUDIO_EVENT.MICRO_READY, room);
      }
    });

    socket.on(AUDIO_EVENT.AUDIO_GAME_READY, (arg, callback) => {
      let room = this.rooms.find((room) => room.id === arg.roomId);
      if (room) {
        const isReady = room.isRoomAudioReady();
        callback(isReady);
      }
    });

    socket.on(AUDIO_EVENT.AUDIO_SYNCHRO, (arg, callback) => {
      callback(Date.now());
    });
  }

  updateRooms(rooms) {
    this.rooms = rooms;
  }
}

export const AudioManagerInstance = AudioManager.Instance;
