<template>
  <div class="relative flex flex-col items-center">
    <div class="flex flex-col items-center">
      <SignboardVue :text="'Enigme n°' + mainStore.gameId" class="z-10" />
      <SignboardVue :text="title" :is-rotate="true" class="text-purple min-w-[25vw] -mt-3" />
    </div>
    <div class="w-full flex flex-col items-center gap-6 bg-green rounded-md p-28 -mt-6">
      <h3 class="text-beige">{{ text }}</h3>
    </div>
    <RoundButtonVue v-if="mainStore.role === ROLE.TEACHER" @click="next" :color="COlOR.PINK" class="mt-8 text-lg font-bold">
      >
    </RoundButtonVue>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {getSocket} from "../../client";
import {useMainStore} from "../../stores/mainStore";
import {useGameStore} from "../../stores/gameStore";
import {COlOR, EVENT, ROLE, STEP} from "../../common/Constants";

import gameData from "./../../assets/game-data/game-data-v2.json";
import SignboardVue from "../common/Signboard.vue";
import RoundButtonVue from "../common/RoundButton.vue";

export default defineComponent({
  name: 'InstructionComponent',
  components: {SignboardVue, RoundButtonVue},
  props: {
    data: Object
  },
  data() {
    return {
      socket: getSocket(),
      mainStore: useMainStore(),
      gameStore: useGameStore(),
    }
  },
  computed: {
    COlOR() {
      return COlOR
    },
    ROLE() {
      return ROLE
    },
    title() {
      return this.$props.data?.introduction.title
    },
    text() {
      return this.$props.data?.introduction.text
    }
  },
  mounted() {
    // Already done in Game.vue
    // if (this.mainStore.role === ROLE.TEACHER) {
    //   this.socket.emit(EVENT.LAUNCH_GAME, {
    //     roomId: this.mainStore.roomId,
    //     gameId: this.mainStore.gameId
    //   });
    // }
  },
  methods: {
    next() {
      this.socket.emit(EVENT.START_GAME, {
        roomId: this.mainStore.roomId,
        step: STEP.PLAY
      });
      this.gameStore.currentStep = STEP.PLAY;
    }
  }
});
</script>

<style lang="scss" scoped>

</style>
