import {io, Socket} from "socket.io-client";
import {pinia} from "./main";
import router from "./router";
import {useMainStore} from "./stores/mainStore";
import {EVENT, ROLE, STEP} from "./common/Constants";
import {Pinia} from "pinia";
import {useGameStore} from "./stores/gameStore";


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
  
  socket.on(EVENT.TOTAL_TEAMS, (arg) => {
    console.log('EVENT.TOTAL_TEAMS', arg)
    gameStore.totalTeams = arg.totalTeams;
  });
  
  socket.on(EVENT.LAUNCH_STORY, async (arg) => {
    await router.push('/chapitre/' + arg.chapterId);
  });
  
  socket.on(EVENT.LAUNCH_GAME, async (arg) => {
    console.log('EVENT.LAUNCH_GAME', arg)
    gameStore.reset();
    gameStore.teamId = arg.teamId;
    gameStore.totalTeams = arg.totalTeams;
    await router.push('/exercice/' + arg.gameId);
  });
  
  socket.on(EVENT.TEAM_VALIDATION, () => {
    console.log('EVENT.TEAM_VALIDATION')
    gameStore.totalTeamsFinished += 1;
  })
  
  socket.on(EVENT.GAME_VALIDATION, () => {
    gameStore.currentStep = STEP.END;
  })
  
  socket.on(EVENT.END_GAME,  () => {
    gameStore.currentStep = STEP.CONGRATS;
  })
  
  socket.on(EVENT.BACK_STORY, async (arg) => {
    gameStore.reset();
    if (mainStore.gameId) {
      mainStore.gameId = arg.gameId;
    }
    await router.push('/chapitre/' + mainStore.getChapterId);
  })
  
  socket.on(EVENT.END_STORY, async (arg) => {
    // TODO :
    switch (mainStore.role) {
      case ROLE.TEACHER:
      case ROLE.STUDENT:
        await router.push('/chapitres');
    }
  })
}

export const connectClient = async () => {
  const mainStore = useMainStore(pinia);
  
  await socket.connect();
  await socket.emit('join', {
    role: mainStore.role,
    roomId: mainStore?.roomId
  });
}
