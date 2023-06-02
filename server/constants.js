export const ROLE = {
  TEACHER: 'teacher',
  STUDENT: 'student',
  PARENT: 'parent'
};

export const EVENT = {
  ROOM_STATUS: 'roomStatus',
  TOTAL_TEAMS: 'totalTeams',  // TODO ; change event
  LAUNCH_CHAPTER: 'launchChapter',
  START_CHAPTER: 'startChapter',
  LAUNCH_GAME: 'launchGame',
  START_GAME: 'startGame',
  TEAM_VALIDATION: 'teamValidation',
  GAME_VALIDATION: 'gameValidation',
  END_GAME: 'endGame',
  BACK_CHAPTER: 'backChapter',
  END_CHAPTER: 'endChapter',
};

export const CHAPTER_STEP = {
  IDLE: 0,
  INTRODUCTION: 1,
  STORY: 2,
  END: 3
}

export const GAME_STEP = {
  IDLE: 0,
  INSTRUCTION: 1,
  PLAY: 2,
  WAIT: 3,
  END: 4,
  CONGRATS: 5
}