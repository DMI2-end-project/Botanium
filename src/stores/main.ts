import {defineStore} from "pinia";
import {Record} from "pocketbase";
import {DatabaseManagerInstance} from "../common/DatabaseManager";
import ROLE from "../constants/ROLE";

export type StoreState = {
  role: typeof ROLE | undefined,
  roles: Record[];
};

export const useStore = defineStore('main', {
  state: (): StoreState => ({
    role: undefined,
    roles: []
  }),
  getters: {
    role(): string {
      let role = this.roles.find(item => item.id === DatabaseManagerInstance.pb.authStore.model?.role)
      return role ? role.name : ''
    }
  },
  actions: {
    async fetchRoles() {
      this.roles = await DatabaseManagerInstance.fetchRoles();
    }
  }
})