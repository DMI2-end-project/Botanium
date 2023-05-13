<script lang="ts">
import {defineComponent} from "vue";
import {useMainStore} from "./stores/mainStore";
import {useGameStore} from "./stores/gameStore";
import {DatabaseManagerInstance} from "./common/DatabaseManager";
import {ROLE} from "./common/Constants";
import {connectClient} from "./client";

import AppLayout from "./layouts/AppLayout.vue";
import DevLayout from "./layouts/DevLayout.vue";
import GameLayout from "./layouts/GameLayout.vue";

export default defineComponent({
  name: 'App',
  components: {AppLayout, DevLayout, GameLayout},
  data() {
    return {
      mainStore: useMainStore(),
      gameStore: useGameStore()
    }
  },
  mounted() {
    this.mainStore.roleId = DatabaseManagerInstance.pb.authStore.model?.role;

    if (DatabaseManagerInstance.pb.authStore.isValid) {
      this.connectSocket()
    }
  },
  methods: {
    async connectSocket() {
      let classRoom = undefined;

      switch (this.mainStore.role) {
        case ROLE.TEACHER:
          classRoom = await DatabaseManagerInstance.pb.collection('classroom').getFirstListItem(`owner="${DatabaseManagerInstance.pb.authStore.model?.id}"`);
          this.mainStore.roomId = classRoom?.id;
          await connectClient();
          break;
        case ROLE.STUDENT:
          classRoom = await DatabaseManagerInstance.pb.collection('classroom').getFirstListItem(`students.id="${DatabaseManagerInstance.pb.authStore.model?.id}"`);
          this.mainStore.roomId = classRoom?.id;
          let teamId = localStorage.getItem('teamId');
          console.log('teamId', teamId);
          this.gameStore.teamId = teamId ? +teamId : undefined;
          await connectClient();
          break;
      }
    }
  }
});
</script>

<template>
  <AppLayout>
    <router-view/>
  </AppLayout>
</template>
