/*  LOGIC  */
export enum ROLE {
  TEACHER = 'teacher',
  STUDENT = 'student',
  PARENT = 'parent'
}

export enum EVENT {
  ROOM_STATUS = 'roomStatus',
  TEAM_STATUS = 'teamStatus',
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

export enum AUDIO_EVENT {
  AUDIO_GAME_READY = 'audioGameReady',
  MICRO_READY = 'microReady',
  AUDIO_SYNCHRO = 'audioSynchro',
  CLAP_SCORE = 'clapScore',
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

export enum LOGBOOK_STEP {
  OPEN_BOOK,
  SELECT_ACTION,
  ADD_PAGE,
  SELECT_PAGE,
  WRITE_OR_DRAW,
  ADD_PHOTO,
  DRAW,
  WRITE,
  SELECT_STICKER,
  SIGN_DRAW,
  SIGN_WRITE,
}

/*  UI  */
export enum COLOR {
  WHITE='white',
  PINK = 'pink',
  GREEN = 'green',
  YELLOW = 'yellow',
  GREEN_MEDIUM = 'greenMedium',
  GREEN_MEDIUM_BEIGE = 'greenMediumBeige',
  GREEN_LIGHT = 'greenLight',
  RED = 'red',
  PURPLE = 'purple',
  BEIGE_MEDIUM = 'beigeMedium',
  BEIGE = 'beige',
  BLUE = 'blue'
}

export enum SIZE {
  XS = 'xs',
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
  XL = 'xl',
}
