// Pocketbase LogBook

interface PageData {
  id: string;
  collectionId: string;
  file: File;
  pageNumber: number;
  template: number;
}

interface TextData {
  id: string;
  content: string;
  slot: number;
  page: string;
  signature: string;
}

interface DrawData {
  id: string;
  collectionId: string;
  file: File;
  slot: number;
  page: string;
  signature: string;
}

interface StickerData {
  id: string;
  page: number;
  slot: string;
  idSticker: number;
}

interface PhotoData {
  id: string;
  collectionId: string;
  file: File;
  slot: number;
  page: string;
}

// Game Data

interface GameData {
  '00101': _00101;
  '00102': _00102;
}

interface _00102 {
}

interface _00101 {
  gameType: string;
  instructionTitle: string;
  instructionText: string;
  congratulation: string;
  waitingMessage: string;
  gameContent: GameContent;
}

interface GameContent {
  '1': _1;
  '2': _1;
}

interface _1 {
  instruction: string;
  congratulation: string;
  congratulationIcon: string;
  answers: Answer[];
}

interface Answer {
  isValid: boolean;
  feedback?: string;
  icon: string;
  text: string;
  isClicked: boolean;
  status: string;
}


export type {PageData, TextData, DrawData, StickerData, PhotoData, GameData, Answer};
