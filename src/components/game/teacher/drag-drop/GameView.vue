<template>
  <div class="w-full relative grid grid-cols-12 gap-4 text-center px-8"><!-- w-full h-full flex-1 flex items-center  -->
    <div class="col-span-10 col-start-2 w-full  grid grid-cols-3 gap-9 rounded-md px-10 pt-9 pb-14 bg-beige-medium">
      <div v-if="answers" v-for="(team, index) in playingTeams" :v-bind="index"
           class="w-full flex flex-col justify-center items-center gap-6">
        <CardGame mode="vertical"  :answer-state="'none'" :card-state="cardState(index)"
                  class="w-full aspect-[5/9]">
          <template v-slot:recto>
            <img v-if="answers[index].image" alt=""
                 :src="`/game/images/${mainStore.getFullGameId}/${answers[index].image}`"
                 class="object-contain object-center"/>
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
    <button v-show="gameStore.currentStep === GAMESTEP.END" class="col-span-12 mx-auto my-5" @click="next">
      Continuer
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

export default defineComponent({
  name: "TeacherGameView",
  components: {CardGame},
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
