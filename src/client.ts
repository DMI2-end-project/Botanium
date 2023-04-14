import {io, Socket} from "socket.io-client";
import {pinia} from "./main";
import router from "./router";
import {useStore} from "./stores/main";
import {EVENT} from "./common/Constants";


// TODO : for production
// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === "production" ? "https://botanium-node-server.fly.dev/" : "http://localhost:8080";

let socket: Socket;
export const getSocket = () => socket;

export const initClient = () => {
  const store = useStore(pinia);

  socket = io(URL, {
    autoConnect: false,
    rejectUnauthorized: false // WARN: please do not do this in production
  });

  socket.on("connect", () => {
    store.connected = true;
  });

  socket.on("disconnect", () => {
    store.connected = false;
  });

  socket.on("join", (arg) => {
    console.log("join", arg);
  });

  socket.on(EVENT.LAUNCH_STORY, async (arg) => {
    // TODO :
  });

  socket.on(EVENT.START_GAME, async (arg) => {
    await router.push('/game');
  });

  socket.on(EVENT.GAME_VALIDATION, async (arg) => {
    // TODO :
  })

  socket.on(EVENT.END_GAME, async (arg) => {
    // TODO :
  })

  socket.on(EVENT.BACK_STORY, async (arg) => {
    // TODO :
  })

  socket.on(EVENT.END_STORY, async (arg) => {
    // TODO :
  })

  socket.on(EVENT.SEND_INSTRUCTION, async (arg) => {
    // TODO :
  })
}

export const connectClient = async () => {
  const store = useStore(pinia);

  await socket.connect();
  await socket.emit('join', {
    role: store.role,
    roomId: store.roomId
  });
}
