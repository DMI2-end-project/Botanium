import {defineStore} from "pinia";
import {Record} from "pocketbase";
import {DatabaseManagerInstance} from "../common/DatabaseManager";
import {leading} from "../common/Lib";
import * as stream from "stream";

export type StoreState = {
  connected: boolean,
  roomId: string | undefined,
  roleId: string | undefined,
  roles: Record[],
  chapterId: number
  gameId: number
};

export const useStore = defineStore('main', {
  state: (): StoreState => ({
    connected: false,
    roomId: undefined,
    roleId: undefined,
    roles: [],
    chapterId: 1,
    gameId: 1
  }),
  getters: {
    role(): string {
      let role = this.roles.find(item => item.id === this.roleId);
      return role ? role.name : undefined;
    },
    fullGameId(): string {
      return leading(this.chapterId, 3) + leading(this.gameId, 2);
    }
  },
  actions: {
    async fetchRoles() {
      this.roles = await DatabaseManagerInstance.fetchRoles();
    }
  }
})