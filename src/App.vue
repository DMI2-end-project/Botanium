<script lang="ts">
import {defineComponent} from "vue";
import {useRouter} from "vue-router";
import {useMainStore} from "./stores/mainStore";
import {useChapterStore} from "./stores/chapterStore";
import {useGameStore} from "./stores/gameStore";
import {DatabaseManagerInstance} from "./common/DatabaseManager";
import {CHAPTER_STEP, COLOR, GAME_STEP, ROLE} from "./common/Constants";
import {connectClient} from "./client";

import AppLayout from "./layouts/AppLayout.vue";
import DevLayout from "./layouts/DevLayout.vue";
import GameLayout from "./layouts/GameLayout.vue";
import ModalView from "./components/common/ModalView.vue";

import chapterData from "./assets/chapters-data/chapters-data.json";
import gameData from "./assets/game-data/game-data-v2.json";
import RoundButton from "./components/common/RoundButton.vue";

export default defineComponent({
  name: 'App',
  computed: {
    COLOR() {
      return COLOR
    }
  },
  components: {RoundButton, ModalView, AppLayout, DevLayout, GameLayout},
  data() {
    return {
      router: useRouter(),
      mainStore: useMainStore(),
      chapterStore: useChapterStore(),
      gameStore: useGameStore(),
      isModal: false
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
          this.gameStore.teamId = teamId ? +teamId : undefined;
          this.gameStore.teamName = teamName ? teamName : undefined;
          await connectClient();

          if (this.chapterStore.currentStep !== CHAPTER_STEP.IDLE && this.router.currentRoute.name !== 'Chapter') {
            this.isModal = true;
            this.mainStore.isModalOpen = true;

          }

          if (this.gameStore.currentStep !== GAME_STEP.IDLE && this.router.currentRoute.name !== 'Game') {
            this.isModal = true;
            this.mainStore.isModalOpen = true;
          }
          break;
      }
    },
    async joinOthers() {
      if (this.chapterStore.currentStep !== CHAPTER_STEP.IDLE && this.router.currentRoute.name !== 'Chapter') {
        this.closeModal()
        await this.router.push(`/chapitre/${this.mainStore.getChapterId}`);
      }

      if (this.gameStore.currentStep !== GAME_STEP.IDLE && this.router.currentRoute.name !== 'Game') {
        this.closeModal()
        await this.router.push(`/exercice/${this.mainStore.getFullGameId}`);
      }
    },
    closeModal() {
      this.isModal = false;
      this.mainStore.isModalOpen = false;
    }
  }
});
</script>

<template>
  <AppLayout>
    <router-view/>
    <ModalView v-if="isModal">
      <div>
        Voulez vous rejoindre la partie en cours ?
        <RoundButton :color="COLOR.GREEN_MEDIUM_BEIGE" @click="joinOthers"/>
        <RoundButton :color="COLOR.RED" @click="closeModal"/>
      </div>
    </ModalView>
  </AppLayout>
</template>
