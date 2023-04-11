import {defineStore} from "pinia";
import {Record} from "pocketbase";
import {DatabaseManagerInstance} from "../common/DatabaseManager";

export type StoreState = {
  role: string,
  roles: Record[];
};

export const useStore = defineStore('main', {
  state: (): StoreState => ({
    role: '',
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