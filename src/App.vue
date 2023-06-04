<script lang="ts">
import {defineComponent} from "vue";
import {useMainStore} from "./stores/mainStore";
import {useChapterStore} from "./stores/chapterStore";
import {useGameStore} from "./stores/gameStore";
import {DatabaseManagerInstance} from "./common/DatabaseManager";
import {ROLE} from "./common/Constants";
import {connectClient} from "./client";

import AppLayout from "./layouts/AppLayout.vue";
import DevLayout from "./layouts/DevLayout.vue";
import GameLayout from "./layouts/GameLayout.vue";
import chapterData from "./assets/chapters-data/chapters-data.json";
import gameData from "./assets/game-data/game-data-v2.json";

export default defineComponent({
  name: 'App',
  components: {AppLayout, DevLayout, GameLayout},
  data() {
    return {
      mainStore: useMainStore(),
      chapterStore: useChapterStore(),
      gameStore: useGameStore()
    }
  },
  beforeCreate() {
    // DATA : chapterData & gameData already exist
  },
  created() {
    // STORES are available
    this.chapterStore.data = chapterData;
    this.gameStore.data = gameData;
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
      localStorage.removeItem('teamName');

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
          let teamName = localStorage.getItem('teamName');
          let currentSequence = localStorage.getItem('currentSequence');
          let currentParagraph = localStorage.getItem('currentParagraph');
          console.log('teamId', teamId, teamName);
          this.gameStore.teamId = teamId ? +teamId : undefined;
          this.gameStore.teamName = teamName ? teamName : undefined;
          this.gameStore.currentSequence = currentSequence ? +currentSequence : 0;
          this.chapterStore.currentParagraph = currentParagraph ? +currentParagraph : 0;
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
