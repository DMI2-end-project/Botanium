<script setup lang="ts">
import {computed} from "vue";
import {useGameStore} from "../../stores/gameStore";
import {useMainStore} from "../../stores/mainStore";
import {COLOR, SIZE, ROLE} from "../../common/Constants";
import {GameMasterManagerInstance} from "../../common/GameMasterManager"
import RoundButton from "../common/RoundButton.vue";
import RoundItemVue from "../common/RoundItem.vue";

import Trophy from "./../../assets/svg/ico-trophy.svg?component";
// TODO : Add ico-arrow.svg
//import Arrow from "../../assets/svg/ico-arrow.svg?component";

const mainStore = useMainStore();
const gameStore = useGameStore();

const currentSection = computed<any>(() => {
  return gameStore.data?.gameSequences[gameStore.currentSequence];
});

const text = () => {
  if (!currentSection.value.congratulation && gameStore.currentSequence + 1 < gameStore.data?.gameSequences.length) {
    // TODO TODO
    //gameStore.currentSequence += 1;
    /*
    while (!this.currentSection.gamemaster && this.gameStore.currentSequence < this.data?.gameSequences.length && this.mainStore.role === ROLE.TEACHER) {
          this.gameStore.currentSequence += 1;
          console.log('currentSequence', this.gameStore.currentSequence);
        }

    return currentSection?.gamemaster.instruction;
     */
  }
  return gameStore.data?.gameSequences[gameStore.currentSequence].congratulation?.text
}

const next = () => {
  GameMasterManagerInstance.backChapter();
}
</script>

<template>
  <div class="relative flex flex-col items-center text-beige text-center my-20">
    <RoundItemVue :size="SIZE.LG" :color="COLOR.YELLOW" class="absolute translate-y-1/2">
      <Trophy class="w-14 aspect-square"/>
    </RoundItemVue>
    <div class="w-full bg-green rounded-md flex flex-col gap-4 items-center py-24 px-28">
      <h1>Incroyable !</h1>
      <p>{{ text() }}</p>
    </div>
    <RoundButton v-if="mainStore.role === ROLE.TEACHER" @click="next" class="mt-8 text-lg font-bold">
      >
    </RoundButton>
  </div>
</template>
