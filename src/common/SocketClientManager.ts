import {io, Socket} from "socket.io-client";
import {Store} from "pinia";
import {StoreState, useStore} from "../stores/main";
import {pinia} from "../main";
import router from "../router";
import {EVENT} from "./Constants";

const URL = process.env.NODE_ENV === "production" ? "https://botanium-node-server.fly.dev/" : "http://localhost:8080";

class SocketClientManager {
  private static _instance: SocketClientManager;
  private _store: Store<"main", StoreState, {role(): string}, {fetchRoles(): Promise<void>}>;

  private _socket: Socket = io(URL, {
    autoConnect: false,
    rejectUnauthorized: false // WARN: please do not do this in production
  });

  private constructor() {
    this._store = useStore(pinia);
    this.listen();
  }

  public static get Instance() {
    // Do you need arguments? Make it a regular static method instead.
    return this._instance || (this._instance = new this());
  }

  get socket() {
    return this._socket;
  }

  private listen = () => {
    this._socket.on("connect", () => {
      this._store.connected = true;
    });

    this._socket.on("disconnect", () => {
      this._store.connected = false;
    });

    this._socket.on("join", (arg) => {
      console.log("join", arg);
    });

    this._socket.on(EVENT.LAUNCH_STORY, async (arg) => {
      // TODO :
    });

    this._socket.on(EVENT.START_GAME, async (arg) => {
      await router.push('/game');
    });

    this._socket.on(EVENT.GAME_VALIDATION, async (arg) => {
      // TODO :
    })

    this._socket.on(EVENT.END_GAME, async (arg) => {
      // TODO :
    })

    this._socket.on(EVENT.BACK_STORY, async (arg) => {
      // TODO :
    })

    this._socket.on(EVENT.END_STORY, async (arg) => {
      // TODO :
    })

    this._socket.on(EVENT.SEND_INSTRUCTION, async (arg) => {
      // TODO :
    })
  }
}

export const SocketClientManagerInstance = SocketClientManager.Instance;
