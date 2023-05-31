import {io, Socket} from "socket.io-client";
import {Pinia} from "pinia";
import {pinia} from "./main";
import router from "./router";
import {useMainStore} from "./stores/mainStore";
import {useGameStore} from "./stores/gameStore";
import {EVENT, ROLE, GAME_STEP} from "./common/Constants";


// TODO : for production
// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === "production" ? "https://botanium-node-server.fly.dev/" : "http://localhost:8080";

let socket: Socket;
export const getSocket = () => socket;

export const initClient = (pinia: Pinia) => {
  const mainStore = useMainStore(pinia);
  const gameStore = useGameStore(pinia);
  
  socket = io(URL, {
    autoConnect: false,
    rejectUnauthorized: false // WARN: please do not do this in production
  });
  
  socket.on("connect", () => {
    mainStore.connected = true;
  });
  
  socket.on("disconnect", () => {
    mainStore.connected = false;
  });
  
  socket.on("join", () => {
    console.log("join", mainStore.roomId);
  });
  
  // TODO
  // socket.on(EVENT.ROOM_STATUS, (arg) => {
  //   console.log('EVENT.ROOM_STATUS', arg)
  
  //   if (arg.chapterId) {
  //     mainStore.chapterId = arg.chapterId
  //   }
  //   if (arg.gameId) {
  //     mainStore.gameId = arg.gameId
  //   }
  //   if (arg.teamsValidation && gameStore.teamId && arg.teamsValidation[gameStore.teamId]) {
  //     gameStore.currentStep = GAMESTEP.WAIT
  //   } else {
  //     if (arg.step) {
  //       gameStore.currentStep = arg.step
  //     }
  //   }
  
  //   if (arg.isPlaying) {
  //     router.push('/exercice/' + mainStore.getFullGameId);
  //   }
  // });
  
  socket.on(EVENT.TOTAL_TEAMS, (arg) => {
    console.log('EVENT.TOTAL_TEAMS', arg)
    gameStore.totalTeams = arg.totalTeams.length;
  });
  
  // socket.on(EVENT.END_STORY, async (arg: any) => {
  //   // TODO :
  //   switch (mainStore.role) {
  //     case ROLE.TEACHER:
  //     case ROLE.STUDENT:
  //       await router.push('/chapitres');
  //   }
  // })
}

export const connectClient = async () => {
  const mainStore = useMainStore(pinia);
  const gameStore = useGameStore(pinia);
  
  await socket.connect();
  await socket.emit('join', {
    role: mainStore.role,
    roomId: mainStore?.roomId,
    teamId: gameStore?.teamId,
    teamName: gameStore?.teamName
  });
}
