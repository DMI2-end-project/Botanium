<template>
  <div class="w-full relative grid grid-cols-12 gap-4 text-center my-auto pt-4"><!-- w-full h-full flex-1 flex items-center  -->
    <div class="col-span-10 col-start-2 xl:col-span-8 xl:col-start-3 2xl:col-span-6 2xl:col-start-4 grid grid-cols-3 gap-9 mx-auto rounded-md p-6 bg-beige-medium"
         :class="`grid-cols-${playingTeams.length}`">
      <div v-if="answers" v-for="(team, index) in playingTeams" :v-bind="index"
           class="w-full flex flex-col justify-center items-center gap-2 max-w-[35vh] mx-auto">
        <CardGame mode="vertical" :answer-state="'none'" :card-state="cardState(index)"
                  class="w-full aspect-[5/9] max-h-[50vh]">
          <template v-slot:recto>
            <img v-if="answers[index].image" alt=""
                 :src="`/game/images/${mainStore.getFullGameId}/${answers[index].image}`"
                 class="object-contain object-center w-full h-full"/>
          </template>
          <template v-slot:verso>
            <div
                class="w-full flex flex-col justify-center items-center bg-beige font-hand-written text-beige-dark text-2xl">
              {{ answers[index].label }}...
            </div>
          </template>
        </CardGame>
        <h3 class="w-full bg-green text-beige rounded-md">
          {{ answers[index].molecule }}
        </h3>
      </div>
    </div>
    <!-- <button v-show="gameStore.currentStep === GAMESTEP.END" class="col-span-12 mx-auto my-5" @click="next">
      Continuer
    </button> -->
    <RoundButton v-show="gameStore.currentStep === GAMESTEP.END" class="col-span-12 mx-auto my-5" @click="next">
      <Arrow class="rotate-180"/>
    </RoundButton>
     <button class="col-span-12 mx-auto my-5 z-10" @click="next">
      Exercice reussi
    </button>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {useGameStore} from "../../../../stores/gameStore";
import {GAME_STEP} from "../../../../common/Constants";
import {GameMasterManagerInstance} from "../../../../common/GameMasterManager";
import CardGame from "../../CardGame.vue";
import { useMainStore } from "../../../../stores/mainStore";
import RoundButton from "../../../common/RoundButton.vue";

import Arrow from "../../../../assets/svg/ico-arrow.svg?component";


export default defineComponent({
  name: "TeacherGameView",
  components: {CardGame, RoundButton, Arrow},
  data() {
    return {
      mainStore: useMainStore(),
      gameStore: useGameStore(),
    }
  },
  computed: {
    GAMESTEP() {
      return GAME_STEP
    },
    answers() {
      return this.gameStore.data.gameSequences[this.gameStore.currentSequence].gamemaster.answers
    },
    playingTeams() {
      return this.gameStore.teams.filter((team: any) => team.isPlaying);
    }
  },
  methods: {
    next() {
      GameMasterManagerInstance.endGame()
    },
    cardState(index: number) {
      if (this.gameStore.currentStep === GAME_STEP.END) {
        return 'show';
      } else {
        if (this.playingTeams[index].isValidated) {
          return 'validated';
        } else {
          return 'hide';
        }
      }
    }
  }
});
</script>
