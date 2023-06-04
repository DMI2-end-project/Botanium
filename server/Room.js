import Team from './Team.js';
import {create} from "@tensorflow-models/speech-commands";

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

export default class Room {
  _id = undefined;
  _teams = [];
  gamemaster = undefined;
  currentParagraph = 0;
  currentSequence = 0;

  chapterId = 0;
  chapterStep = 0;

  gameId = 0;
  gameStep = 0;

  _names = [
    {
      name: 'Les papillons',
      isTaken: false
    }, {
      name: 'Les escargots',
      isTaken: false
    }, {
      name: 'Les graines',
      isTaken: false
    }, {
      name: 'Les tulipes',
      isTaken: false
    }, {
      name: 'Les arrosoirs',
      isTaken: false
    }, {
      name: 'Les oiseaux',
      isTaken: false
    }
  ];

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
    return this._teams.filter(t => t.isPlaying);
  }

  get validatedTeams() {
    return this.playingTeams.filter((t) => t.isValidated);
  }

  isClapReady() {
    return this.playingTeams.filter((t) => t.hasMicro === null).length > 0 ? null :
      (this.playingTeams.filter((t) => t.hasMicro).length >= 1 ? true : false);
  }

  isGameFinished() {
    return this.validatedTeams.length >= this.playingTeams.length;
  }

  addTeam(socketId, teamName) {
    /*  With router.push we keep our socketId from page to page */
    let team = this._teams.find(t => t.socketId === socketId);

    if (!team) {
      /*  When we loose the connection or reload page socketId is changing */
      team = this._teams.find(t => t.name === teamName);
      if (!team) {
        team = this.createTeam(socketId);
      } else {
        if (!team.isConnected) {
          team.socketId = socketId;
          team.isConnected = true;
        } else {
          team = this.createTeam(socketId);
        }
      }
    }

    return team;
  }

  createTeam(socketId) {
    let team = new Team(socketId);
    let i = 0;
    while (this._names[i].isTaken && i < this._names.length - 1) {
      i++;
    }
    if (this._names[i].isTaken) {
      // Debug
      team.name = 'random' + Math.round(Math.random() * 100);
    } else {
      team.name = this._names[i].name;
      this._names[i].isTaken = true;
    }
    this._teams.push(team);
    return team;
  }

  removeTeam(socketId) {
    let teamIndex = this._teams.findIndex(t => t.socketId === socketId);

    if (teamIndex > -1) {
      this._teams[teamIndex].isConnected = false;
      return this._teams[teamIndex];
    }
  }

  reset = () => {
    this.currentParagraph = 0;
    this.currentSequence = 0;

    this.chapterId = 0;
    this.chapterStep = 0;

    this.gameId = 0;
    this.gameStep = 0;

    this._teams.map(team => team.reset());
  }

  shuffleTeams() {
    this._teams = shuffle(this._teams);
  }
}