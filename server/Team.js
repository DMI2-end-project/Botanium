export default class Team {
  _socketId = undefined;  // string
  _teamId = undefined;  // number   : gameData.gameSequences.teams[0]
  _name = undefined;  // string
  isPlaying = false;  // boolean
  isConnected = true;  // boolean
  isValidated = false;  // boolean
  hasMicro = null;  // boolean
  currentSequence = 0;  // number

  constructor(id) {
    this._socketId = id;
  }


  reset() {
    this.isPlaying = false;
    this.isValidated = false;
    this.hasMicro = null;
    this.currentSequence = 0;
  }

  set socketId(id) {
    this._socketId = id;
  }

  get socketId() {
    return this._socketId;
  }

  set teamId(id) {
    this._teamId = id;
  }

  get teamId() {
    return this._teamId;
  }

  get name() {
    return this._name;
  }

  set name(name) {
    this._name = name;
  }
}
