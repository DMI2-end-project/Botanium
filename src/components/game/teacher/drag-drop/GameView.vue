<template>
  <div class="w-full relative grid grid-cols-12 gap-4 text-center my-auto pt-4">
    <div class="col-span-10 col-start-2 sm:col-span-8 sm:col-start-3 xl:col-span-6 xl:col-start-4 flex">
      <DragDropGrid>
        <div v-if="answers" v-for="(team, index) in playingTeams" :v-bind="index"
             class="flex flex-col justify-center items-center gap-2 mx-auto">
          <div class="h-full aspect-[5/9]">
            <CardGame mode="vertical" :answer-state="'none'" :card-state="cardState(index)"
                      class="max-h-[50vh]">
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
    <button class="absolute top-[80px] right-[30px]" @click="next">
      Do
    </button>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {useGameStore} from "../../../../stores/gameStore";
import {GAME_STEP} from "../../../../common/Constants";
import {GameMasterManagerInstance} from "../../../../common/GameMasterManager";
import CardGame from "../../CardGame.vue";
import {useMainStore} from "../../../../stores/mainStore";
import RoundButton from "../../../common/RoundButton.vue";

import Arrow from "../../../../assets/svg/ico-arrow.svg?component";
import DragDropGrid from "../../DragDropGrid.vue";


export default defineComponent({
  name: "TeacherGameView",
  components: {DragDropGrid, CardGame, RoundButton, Arrow},
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

<style>
.fill {
  width: -webkit-fill-available;
}
</style>
