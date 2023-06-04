export default class Team {
  _socketId = undefined;
  _teamId = undefined; // number : gameData.gameSequences.teams[0]
  _name = undefined;
  isPlaying = false;
  isConnected = true;
  isValidated = false;
  hasMicro = null; // boolean
  currentSequence = 0;

  constructor(id) {
    this._socketId = id;
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

  reset() {
    this.isPlaying = false;
    this.isValidated = false;
    this.hasMicro = null;
    this.currentSequence = 0;
  }
}
