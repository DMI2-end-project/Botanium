import {reactive} from "vue";
import {io} from "socket.io-client";

export const state = reactive({
  connected: false,
});

// TODO : for production
// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === "production" ? "https://botanium-node-server.fly.dev/" : "http://localhost:8080";

export const socket = io(URL, {
  autoConnect: false,
  rejectUnauthorized: false // WARN: please do not do this in production
});

socket.on("connect", () => {
  state.connected = true;
});

socket.on("disconnect", () => {
  state.connected = false;
});

socket.on("join", (arg)=>{
  console.log("join", arg);
})


// TODO : broadcast Start game

/*
* LaunchStory = histoire
* SendInstruction = énoncé global
* StartGame = énoncé/résolution spécifique
* TeamValidation = résolution true
* GameValidation = all true
* Congratulation
* Next
* EndStory
* */