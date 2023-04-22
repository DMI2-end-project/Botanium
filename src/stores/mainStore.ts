import {defineStore} from "pinia";
import {Record} from "pocketbase";
import {DatabaseManagerInstance} from "../common/DatabaseManager";
import {leading} from "../common/Lib";

export type StoreState = {
  connected: boolean,
  roomId: string | undefined,
  roleId: string | undefined,
  roles: Record[],
  chapterId: number | undefined
  gameId: number | undefined,
  totalGames: number
};

export const useMainStore = defineStore('main', {
  state: (): StoreState => ({
    connected: false,
    roomId: '2023',
    roleId: undefined,
    roles: [],
    chapterId: 1,
    gameId: 1,
    totalGames: 1 // TODO : fetch from ???
  }),
  getters: {
    role(): string {
      let role = this.roleId ? this.roleId : DatabaseManagerInstance.pb.authStore.model?.role;
      role = this.roles.find(item => item.id === this.roleId);
      return role ? role.name : undefined;
    },
    getChapterId(): string|undefined {
      if (this.chapterId) {
        return leading(this.chapterId, 3)
      }
    },
    getGameId(): string|undefined {
      if (this.gameId) {
        return leading(this.gameId, 2)
      }
    },
    getFullGameId(): string|undefined {
      if (this.chapterId && this.gameId) {
        return leading(this.chapterId, 3) + leading(this.gameId, 2);
      }
    },
  },
  actions: {
    async fetchRoles() {
      this.roles = await DatabaseManagerInstance.fetchRoles();
    },
    reset() {
      this.connected = false;
      this.roomId = undefined;
      this.roleId = undefined;
      this.chapterId = undefined;
      this.gameId = 1;
    }
  }
})