let names = ['les papillons', 'les castors', 'les graines'];

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

class Team {
  _socketId = undefined;
  _teamId = undefined;
  _name = undefined;
  isPlaying = false;
  isConnected = true;
  isValidated = false;

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
  }
}

class Room {
  _id = undefined;
  _teams = [];
  gamemaster = undefined;

  isReading = false;
  chapterId = 0;
  chapterStep = 0;

  isPlaying = false;
  gameId = 0;
  gameStep = 0;

  constructor(id) {
    this._id = id;
  }

  get id() {
    return this._id;
  }

  get teams() {
    return this._teams;
  }

  get connectedTeams() {
    return this._teams.filter(t => t.isConnected);
  }

  get playingTeams() {
    console.log('playingTeams', this._teams.filter(t => t.isPlaying))
    return this._teams.filter(t => t.isPlaying);
  }

  get validatedTeams() {
    return this.playingTeams.filter(t => t.isValidated)
  }

  addTeam(socketId, teamName) {
    let team = this._teams.find(t => t.name === teamName || t.socketId === socketId);

    if (team) {
      team.socketId = socketId;
      team.isConnected = true;
    } else {
      team = new Team(socketId);
      team.name = names[0];
      this._teams.push(team);
    }

    console.log('addTeam', teamName, team, this.teams);
  }

  removeTeam(socketId) {
    let teamIndex = this._teams.findIndex(t => t.socketId === socketId);
    console.log('removeTeam :', socketId, teamIndex);

    if (teamIndex > -1) {
      this._teams[teamIndex].isConnected = false;
    }
    console.log(this, this._teams, this._teams[teamIndex]);
  }

  reset = () => {
    this.isReading = false;
    this.chapterId = 0;
    this.chapterStep = 0;

    this.isPlaying = false;
    this.gameId = 0;
    this.gameStep = 0;

    this._teams.map(team => team.reset());
  }

  shuffleTeams() {
    this._teams = shuffle(this._teams);
  }
}

export {Room, Team};