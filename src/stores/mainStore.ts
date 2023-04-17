import {defineStore} from "pinia";
import {Record} from "pocketbase";
import {DatabaseManagerInstance} from "../common/DatabaseManager";
import {leading} from "../common/Lib";

export type StoreState = {
  connected: boolean,
  roomId: string | undefined,
  roleId: string | undefined,
  roles: Record[],
  chapterId: number
  gameId: number
};

export const useMainStore = defineStore('main', {
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
      let role = this.roleId ? this.roleId : DatabaseManagerInstance.pb.authStore.model?.role;
      role = this.roles.find(item => item.id === this.roleId);
      return role ? role.name : undefined;
    },
    getChapterId(): string {
      return leading(this.chapterId, 3)
    },
    getGameId(): string{
      return leading(this.gameId, 2)
    },
    getFullGameId(): string {
      return leading(this.chapterId, 3) + leading(this.gameId, 2);
    },
  },
  actions: {
    async fetchRoles() {
      this.roles = await DatabaseManagerInstance.fetchRoles();
    }
  }
})