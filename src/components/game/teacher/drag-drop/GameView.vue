<template>
  <div class="w-full relative grid grid-cols-12 gap-4 text-center my-auto pt-4">
    <div class="col-span-10 col-start-2 sm:col-span-8 sm:col-start-3 xl:col-span-6 xl:col-start-4 flex">
      <DragDropGrid>
        <div v-if="answers" v-for="(team, index) in playingTeams" :v-bind="index"
             class="w-full flex flex-col justify-center items-center gap-6 z-10 max-w-[25vh]">
          <div
              class="relative w-full rounded-lg overflow-hidden aspect-[5/9] max-h-[40vh] bg-beige rounded-md flex items-center justify-center">
            <CardGame mode="vertical" :answer-state="'none'"
                      :card-state="gameStore.currentStep === GAME_STEP.END ? 'show' : 'validated'"
                      class="relative w-full h-full z-10"
                      :class="!playingTeams[index]?.isValidated ? 'opacity-0 pointer-events-none' : ''">
              <template v-slot:recto>
                <img alt=""
                     :src="`/game/images/${mainStore.getFullGameId}/${answers[index].image}`"
                     class="w-full h-full object-contain object-center"/>
                <div class="absolute left-4 bottom-2 flex flex-col gap-2">
                  <p><b>La carotte</b></p>
                  <p v-if="answers[index]" class="font-hand-written text-lg">{{ answers[index].name }}</p>
                </div>
              </template>
            </CardGame>
            <CardSlot class="!absolute top-0 left-0 w-full h-full aspect-[5/9]" shadow>
              <span class="font-hand-written text-beige-dark text-2xl leading-none">{{ answers[index].label }}...</span>
            </CardSlot>
          </div>
          <div class="w-full bg-green text-beige rounded-md fill">
            <h3>{{ answers[index].molecule }}</h3>
          </div>
        </div>
      </DragDropGrid>
    </div>
    <RoundButton v-show="gameStore.currentStep === GAMESTEP.END" class="col-span-12 mx-auto my-5" @click="next">
      <Arrow class="rotate-180"/>
    </RoundButton>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {useMainStore} from "../../../../stores/mainStore";
import {useGameStore} from "../../../../stores/gameStore";
import {GAME_STEP} from "../../../../common/Constants";
import {GameMasterManagerInstance} from "../../../../common/GameMasterManager";

import RoundButton from "../../../common/RoundButton.vue";
import DragDropGrid from "../../DragDropGrid.vue";
import CardGame from "../../CardGame.vue";
import CardSlot from "../../CardSlot.vue";

import Arrow from "../../../../assets/svg/ico-arrow.svg?component";

export default defineComponent({
  name: "TeacherGameView",
  components: {CardSlot, DragDropGrid, CardGame, RoundButton, Arrow},
  data() {
    return {
      mainStore: useMainStore(),
      gameStore: useGameStore(),
    }
  },
  computed: {
    GAME_STEP() {
      return GAME_STEP
    },
    GAMESTEP() {
      return GAME_STEP
    },
    answers() {
      let answers = this.gameStore.data.gameSequences[this.gameStore.currentSequence].gamemaster.answers
      return answers;
    },
    playingTeams() {
      return this.gameStore.teams.filter((team: any) => team.isPlaying);
    }
  },
  methods: {
    next() {
      GameMasterManagerInstance.endGame();
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

<style>
.fill {
  width: -webkit-fill-available;
}
</style>
