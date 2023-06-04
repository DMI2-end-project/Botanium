import {defineStore} from "pinia";
import {Record} from "pocketbase";
import {DatabaseManagerInstance} from "../common/DatabaseManager";
import {leading} from "../common/Lib";

export type StoreState = {
  isModalOpen: boolean,
  askForRedirection: boolean,
  connected: boolean,
  roomId: string | undefined,
  roleId: string | undefined,
  roles: Record[],
  dbChapterId: string | undefined,
  chapterId: number
  gameId: number,
};

export const useMainStore = defineStore('main', {
  state: (): StoreState => ({
    isModalOpen: true,
    askForRedirection: false,
    connected: false,
    roomId: undefined,
    roleId: undefined,
    roles: [],
    dbChapterId: undefined,
    chapterId: 0,
    gameId: 0,
  }),
  getters: {
    role(): string {
      let role = this.roleId ? this.roleId : DatabaseManagerInstance.pb.authStore.model?.role;
      role = this.roles.find(item => item.id === this.roleId);
      return role ? role.name : undefined;
    },
    getChapterId(): string {
      return leading(this.chapterId, 3)
    },
    getGameId(): string {
      return leading(this.gameId, 2)
    },
    getFullGameId(): string {
      return leading(this.chapterId, 3) + leading(this.gameId, 2);
    },
  },
  actions: {
    reset() {
      this.isModalOpen = false;
      this.askForRedirection = false;
      this.connected = false;
      this.roomId = undefined;
      this.roleId = undefined;
      this.chapterId = 0;
      this.gameId = 0;
    }
  }
})
