<script setup lang="ts">
import {computed} from "vue";
import {useGameStore} from "../../stores/gameStore";
import {useMainStore} from "../../stores/mainStore";
import {AUDIO, COLOR, ROLE, SIZE} from "../../common/Constants";
import {GameMasterManagerInstance} from "../../common/GameMasterManager"
import RoundButton from "../common/RoundButton.vue";
import RoundItemVue from "../common/RoundItem.vue";

import Trophy from "./../../assets/svg/ico-trophy.svg?component";
import Arrow from "./../../assets/svg/ico-arrow.svg?component";
import {AudioManagerInstance} from "../../common/AudioManager";

const mainStore = useMainStore();
const gameStore = useGameStore();

if (mainStore.role === ROLE.TEACHER) {
  AudioManagerInstance.play(AUDIO.VICTORY);
}

const currentSection = computed<any>(() => {
  return gameStore.data?.gameSequences[gameStore.currentSequence];
});

const text = () => {
  if (!currentSection.value.congratulation && gameStore.currentSequence < gameStore.data?.gameSequences.length - 1) {
    gameStore.currentSequence += 1;
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
  <div class="relative flex flex-col items-center text-beige text-center -mt-16">
    <RoundItemVue :size="SIZE.LG" :color="COLOR.YELLOW" class="absolute translate-y-1/2">
      <Trophy class="w-14 aspect-square"/>
    </RoundItemVue>
    <div
        class="w-full min-h-[200px] max-h-[300px] flex flex-col justify-center items-center gap-6 bg-green rounded-md p-10 pt-20">
      <h1>Incroyable !</h1>
      <p>{{ text() }}</p>
    </div>
    <RoundButton v-if="mainStore.role === ROLE.TEACHER" @click="next" :color="gameStore.data.colorButton"
                 class="mt-8 text-lg font-bold">
      <Arrow class="rotate-180"/>
    </RoundButton>
  </div>
</template>
