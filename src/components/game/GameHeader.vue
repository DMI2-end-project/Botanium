<template>
  <div class="relative grid grid-cols-12 gap-4 px-8">
    <div class="absolute top-2 left-2 text-xl">
      <RoundItem :color="COLOR.YELLOW" :isEnigma="true">
        {{ mainStore.gameId }}
      </RoundItem>
    </div>
    <p class="col-start-3 col-span-8 bg-green text-beige text-center leading-tight py-7 px-8 rounded-md">{{ text }}</p>
    <button v-show="mainStore.role === ROLE.STUDENT" class="absolute right-0 top-1/2 -translate-y-1/2">Mémo</button>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {useGameStore} from "../../stores/gameStore";
import {useMainStore} from "../../stores/mainStore";
import { ROLE, COLOR, SIZE } from "../../common/Constants";
import RoundItem from "../common/RoundItem.vue";

export default defineComponent({
  name: 'GameHeader',
  components: {
    RoundItem
  },
  data() {
    return {
      mainStore: useMainStore(),
      gameStore: useGameStore(),
      publicPath: window.location.origin,
    }
  },
  computed: {
    ROLE() {
      return ROLE
    },
    COLOR() {
      return COLOR
    },
    SIZE() {
      return SIZE
    },
    currentSection() {
      return this.gameStore.data?.gameSequences[this.gameStore.currentSequence]
    },
    text() {
      if (this.gameStore.teamId !== undefined) {
        let index = this.currentSection.teamsNeeded ? this.gameStore.teamId : 0;
        return this.currentSection.teams[index].instruction;
      } else {
        return this.currentSection.gamemaster?.instruction;
      }
    }
  }
});
</script>

<style lang="scss" scoped>

</style>
