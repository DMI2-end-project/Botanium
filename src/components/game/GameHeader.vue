<template>
  <div class="relative grid grid-cols-12 gap-4 px-8">
    <div class="absolute top-0 left-0 text-xl">
      <div class="aspect-square w-20 text-beige bg-secondary rounded-full font-bold p-1.5">
      <span
          class="block w-full h-full flex justify-center items-center rounded-full border border-beige bg-secondary p-2">
        {{ mainStore.gameId }}
      </span>
      </div>
    </div>
    <p class="col-start-3 col-span-8 bg-green text-beige leading-tight py-7 px-8 rounded-md">{{ text }}</p>
    <button v-show="mainStore.role === ROLE.STUDENT" class="absolute right-0 top-1/2 -translate-y-1/2">Mémo</button>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {useGameStore} from "../../stores/gameStore";
import {useMainStore} from "../../stores/mainStore";
import {ROLE} from "../../common/Constants";

export default defineComponent({
  name: 'GameHeader',
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
