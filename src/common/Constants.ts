export enum ROLE {
  TEACHER = 'teacher',
  STUDENT = 'student',
  PARENT = 'parent'
}

export enum EVENT {
  TOTAL_TEAMS = 'TotalTeams',
  LAUNCH_STORY = 'LaunchStory',
  LAUNCH_GAME = 'LaunchGame',
  START_GAME = 'StartGame',
  TEAM_VALIDATION = 'TeamValidation',
  GAME_VALIDATION = 'GameValidation',
  END_GAME = 'EndGame',
  BACK_STORY = 'BackStory',
  END_STORY = 'EndStory',
}

export enum CLAPEVENT {
  CLAP_LAUNCH = 'clapLaunch',
  CLAP_READY = 'clapReady',
  CLAP_SCORE = 'clapScore',
  CLAP_SYNCHRO = 'clapSynchro',
}

export enum STEP {
  INSTRUCTION,
  PLAY,
  WAIT,
  END,
  CONGRATS
}

export enum GAMETYPE {
  MCQ = 'multiple-choice',
  Rhythm = "rhythm"
}
