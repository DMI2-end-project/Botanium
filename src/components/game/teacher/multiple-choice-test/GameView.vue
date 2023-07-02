<template>
  <div class="relative grid grid-cols-2 auto-rows-fr gap-4 px-8 pt-4">
    <CardGame v-for="(team, index) in playingTeams" :v-bind="index"
              mode="horizontal"
              :answer-state="'none'" :card-state="cardState(index)"
              class="w-full h-full aspect-[9/4] max-h-[30vh] max-w-[70vh] text-center"
              :class="index % 2 === 0 ? 'ml-auto' : 'mr-auto'">
      <template v-slot:recto>
        <div class="w-full h-full flex flex-col justify-center items-center gap-1.5">
          <SvgIcon :name="answers[index].icon" class="w-16 aspect-square pointer-events-none"/>
          <span class="text-md pointer-events-none">{{ answers[index].text }}</span>
        </div>
      </template>
      <template v-slot:verso>
        <span class="text-xl text-beige-medium font-bold">{{ team._name }}</span>
      </template>
    </CardGame>
    <!--div v-for="(answer, index) in answers" :v-bind="index" class="w-full rounded-md p-3.5">
      <div :data-id="index" class="w-full h-full bg-beige rounded-md shadow-md w-max-content py-14 px-10"
           :class="answer.status === 'valid' && gameStore.currentStep === GAMESTEP.PLAY ? 'bg-green-light' : 'bg-beige'">
        <div v-show="gameStore.currentStep === GAMESTEP.PLAY">
          <span v-show="answer.status !== 'valid'" class="text-3xl text-beige-medium font-bold">{{ index + 1 }}</span>
          <Check v-show="answer.status === 'valid'" class="w-16"/>
        </div>
        <div v-show="gameStore.currentStep === GAMESTEP.END"
             class="flex flex-col items-center text-center text-green gap-5">
          <img :src="'/game/icons/'+ mainStore.getFullGameId +'/' + answer.icon" alt=""
               class="w-16 pointer-events-none aspect-square">
          <span class="text-md pointer-events-none">{{ answer.text }}</span>
        </div>
      </div>
    </div-->
  </div>
  <RoundButton @click="next" :color="COLOR.GREEN_LIGHT"
               :class="gameStore.currentStep === GAMESTEP.END ? '' : 'opacity-0 pointer-events-none'"
               class="mx-auto mt-4">
    <Check/>
  </RoundButton>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {getSocket} from "../../../../client";
import {useMainStore} from "../../../../stores/mainStore";
import {useGameStore} from "../../../../stores/gameStore";
import {COLOR, GAME_STEP} from "../../../../common/Constants";
import {GameMasterManagerInstance} from "../../../../common/GameMasterManager"
import CardGame from "../../CardGame.vue";
import RoundButton from "../../../common/RoundButton.vue";
import SvgIcon from "../../../common/SvgIcon.vue";

import Check from "../../../../assets/svg/ico-check.svg?component";

export default defineComponent({
  name: 'TeacherGameView',
  components: {Check, CardGame, RoundButton, SvgIcon},
  data() {
    return {
      mainStore: useMainStore(),
      gameStore: useGameStore(),
      socket: getSocket(),
    }
  },
  computed: {
    COLOR() {
      return COLOR
    },
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
