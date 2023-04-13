import {defineStore} from "pinia";
import {Record} from "pocketbase";
import {DatabaseManagerInstance} from "../common/DatabaseManager";

export type StoreState = {
  connected: boolean,
  roomId: string | undefined,
  roles: Record[];
};

export const useStore = defineStore('main', {
  state: (): StoreState => ({
    connected: false,
    roomId: undefined,
    roles: []
  }),
  getters: {
    role(): string {
      let role = this.roles.find(item => item.id === DatabaseManagerInstance.pb.authStore.model?.role)
      return role ? role.name : undefined
    }
  },
  actions: {
    async fetchRoles() {
      this.roles = await DatabaseManagerInstance.fetchRoles();
    }
  }
})