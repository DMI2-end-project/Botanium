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
import RoundButton from "./components/common/RoundButton.vue";

import chapterData from "./assets/chapters-data/chapters-data.json";
import gameData from "./assets/game-data/game-data.json";

import Check from "./assets/svg/ico-check.svg?component";
import Cross from "./assets/svg/ico-cross.svg?component";


export default defineComponent({
  name: 'App',
  components: {RoundButton, ModalView, AppLayout, DevLayout, GameLayout, Check, Cross},
  data() {
    return {
      router: useRouter(),
      mainStore: useMainStore(),
      chapterStore: useChapterStore(),
      gameStore: useGameStore(),
      isModalOpen: false
    }
  },
  computed: {
    COLOR() {
      return COLOR
    }
  },
  beforeCreate() {
    // DATA : chapterData & gameData already exist
  },
  created() {
    // STORES are available
    this.chapterStore.data = this.mainStore.chapterData[this.mainStore.getChapterId];
    this.gameStore.data = this.mainStore.gameData[this.mainStore.getFullGameId];

    this.mainStore.$subscribe((mutation, state) => {
      if (state.askForRedirection) {
        this.isModalOpen = true;
        this.mainStore.isModalOpen = true;
      }
    });
  },
  mounted() {
    this.mainStore.roleId = DatabaseManagerInstance.pb.authStore.model?.role;

    if (DatabaseManagerInstance.pb.authStore.isValid) {
      this.connectSocket()
    }
  },
  methods: {
    async connectSocket() {
      this.mainStore.roomId = await DatabaseManagerInstance.getRoomId(this.mainStore.role);

      switch (this.mainStore.role) {
        case ROLE.TEACHER:
          await connectClient();
          break;
        case ROLE.STUDENT:
          let teamId = localStorage.getItem('teamId');
          let teamName = localStorage.getItem('teamName');
          this.gameStore.teamId = teamId ? +teamId : undefined;
          this.gameStore.teamName = teamName ? teamName : undefined;
          await connectClient();
          break;
      }
    },
    async joinOthers() {
      if (this.chapterStore.currentStep !== CHAPTER_STEP.IDLE && this.router.currentRoute.name !== 'Chapter') {
        await this.closeModal()
        await this.router.push(`/chapitre/${this.mainStore.getChapterId}`);
      }

      if (this.gameStore.currentStep !== GAME_STEP.IDLE && this.router.currentRoute.name !== 'Game') {
        await this.closeModal()
        await this.router.push(`/exercice/${this.mainStore.getFullGameId}`);
      }
    },
    dontJoin() { // TODO
      localStorage.setItem('join', 'false');
    },
    closeModal() {
      this.isModalOpen = false;
      this.mainStore.isModalOpen = false;
      this.mainStore.askForRedirection = false;
    }
  }
})
;
</script>

<template>
  <AppLayout>
    <router-view/>
    <ModalView v-if="isModalOpen" @close="closeModal" :close="false" :click-outside="true">
      <h1>Attention !</h1>
      <p>Il y a une partie en cours, est-ce que tu veux la rejoindre ?</p>
      <div class="flex justify-center items-center gap-6">
        <RoundButton :color="COLOR.GREEN_MEDIUM_BEIGE" @click="()=>joinOthers()">
          <Check/>
        </RoundButton>
        <RoundButton :color="COLOR.RED" @click="()=>closeModal()">
          <Cross/>
        </RoundButton>
      </div>
    </ModalView>
  </AppLayout>
</template>
