<template>
  <div class="relative flex flex-col items-center">
    <div class="flex flex-col items-center">
      <SignboardVue :text="'Enigme n°' + mainStore.gameId" class="z-10" />
      <SignboardVue :text="title" :is-rotate="true" class="text-purple min-w-[25vw] -mt-3" />
    </div>
    <div class="w-full flex flex-col items-center gap-6 bg-green rounded-md p-28 -mt-6">
      <h3 class="text-beige">{{ text }}</h3>
    </div>
    <RoundButton v-if="mainStore.role === ROLE.TEACHER" @click="next" :color="COLOR.PINK" class="mt-8 text-lg font-bold">
      >
    </RoundButton>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {useMainStore} from "../../stores/mainStore";
import {useGameStore} from "../../stores/gameStore";
import { COLOR, ROLE } from "../../common/Constants";
import { GameMasterManagerInstance } from "../../common/GameMasterManager";

import SignboardVue from "../common/Signboard.vue";
import RoundButton from "../common/RoundButton.vue";

export default defineComponent({
  name: 'InstructionComponent',
  components: {SignboardVue, RoundButton},
  data() {
    return {
      mainStore: useMainStore(),
      gameStore: useGameStore(),
    }
  },
  computed: {
    COLOR() {
      return COLOR
    },
    ROLE() {
      return ROLE
    },
    title() {
      return this.gameStore.data?.introduction.title
    },
    text() {
      return this.gameStore.data?.introduction.text
    }
  },
  methods: {
    next() {
      GameMasterManagerInstance.startGame()
    },
    openModal() {
      console.log('yooo')
    }
  }
});
</script>
