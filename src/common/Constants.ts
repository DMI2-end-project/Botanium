/*  LOGIC  */
export enum ROLE {
  TEACHER = 'teacher',
  STUDENT = 'student',
  PARENT = 'parent'
}

export enum EVENT {
  ROOM_STATUS = 'roomStatus',
  TOTAL_TEAMS = 'totalTeams',
  LAUNCH_CHAPTER = 'launchChapter',
  START_CHAPTER = 'startChapter',
  NEXT_PARAGRAPH = 'nextParagraph',
  LAUNCH_GAME = 'launchGame',
  START_GAME = 'startGame',
  GAME_NEXT_SEQUENCE = 'gameNextSequence',
  TEAM_NEXT_SEQUENCE = 'teamNextSequence',
  TEAM_VALIDATION = 'teamValidation',
  GAME_VALIDATION = 'gameValidation',
  END_GAME = 'endGame',
  BACK_CHAPTER = 'backChapter',
  END_CHAPTER = 'endChapter',
}

export enum CLAP_EVENT {
  CLAP_LAUNCH = 'clapLaunch',
  CLAP_READY = 'clapReady',
  CLAP_SCORE = 'clapScore',
  CLAP_SYNCHRO = 'clapSynchro',
}

export enum CHAPTER_STATUS {
  TODO = 'todo',
  IN_PROGRESS = 'inProgress',
  PAUSE = 'pause',
  DONE = 'done'
}

export enum CHAPTER_STEP {
  IDLE,
  INTRODUCTION,
  STORY,
  END
}

export enum GAME_STEP {
  IDLE,
  INSTRUCTION,
  PLAY,
  WAIT,
  END,
  CONGRATS
}

export enum GAME_TYPE {
  DRAG_DROP = 'dragDrop',
  MCQ = 'multipleChoice',
  RHYTHM = "rhythm",
  SWIPE = 'swipe',
  CURSOR = 'cursor',
}

/*  UI  */
export enum COLOR {
  PINK = 'pink',
  GREEN = 'green',
  YELLOW = 'yellow',
  GREEN_MEDIUM = 'greenMedium',
  GREEN_MEDIUM_BEIGE = 'greenMediumBeige',
  GREEN_LIGHT = 'greenLight'
}

export enum SIZE {
  XS = 'xs',
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
  XL = 'xl',
}
