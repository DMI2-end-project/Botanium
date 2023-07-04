<template>
  <div class="w-3/4 mx-auto">
    <div class="flex justify-around gap-24">
      <div v-for="(team, index) in playingTeams" :v-bind="index"
           class="box relative flex-1 max-w-[25vw] h-[20vw] outline-2 outline-dashed outline-white rounded-lg  flex flex-col items-center justify-center"
           :class="(cardState(index) === 'validated' ? 'bg-green-light' : 'bg-yellow') + (cardState(index) === 'show' ? ' -outline-offset-2' : ' outline-offset-8')">
            <img alt="" :src="publicPath + '/game/images/00103/' + answers[index].image"
             class="grayscale brightness-50 w-2/5 opacity-30" :class="(cardState(index) === 'validated' ? ' !opacity-0' : ' ')">
             <Deco :class="(cardState(index) === 'validated' ? ' ' : ' !opacity-0')" class="absolute h-[30%] m-2 aspect-square top-1 left-1 "/>
            <Deco :class="(cardState(index) === 'validated' ? ' ' : ' !opacity-0')" class="absolute h-[30%] m-2 aspect-square top-1 right-1 -scale-x-100"/>
            <Deco :class="(cardState(index) === 'validated' ? ' ' : ' !opacity-0')" class="absolute h-[30%] m-2 aspect-square bottom-1 left-1 -scale-y-100"/>
            <Deco :class="(cardState(index) === 'validated' ? ' ' : ' !opacity-0')" class="absolute h-[30%] m-2 aspect-square bottom-1 right-1 -scale-100" />
            <Check class="absolute text-green-dark aspect-square w-16" :class="(cardState(index) === 'validated' ? ' ' : ' !opacity-0')"/>
        <div
            class="absolute w-full h-full bg-beige flex flex-col items-center justify-center outline-1 outline outline-beige-dark rounded-lg -outline-offset-8 transform transition-all duration-1000 delay-100"
            :class="cardState(index) === 'show' ? 'scale-100 translate-y-0 opacity-1' : 'scale-110 -translate-y-14 opacity-0'">
          <img alt="" :src="publicPath + '/game/images/00103/' + answers[index].image" class="w-2/5">
        </div>
      </div>
    </div>
    <RoundButton v-show="gameStore.currentStep === GAMESTEP.END" :color="COLOR.GREEN" class="mx-auto mt-8"
                 @click="next">
      <Arrow class="rotate-180"/>
    </RoundButton>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {useGameStore} from "../../../../stores/gameStore";
import {GAME_STEP, COLOR, AUDIO} from "../../../../common/Constants";
import {GameMasterManagerInstance} from "../../../../common/GameMasterManager";
import {AudioManagerInstance} from "../../../../common/AudioManager";
import RoundButton from '../../../common/RoundButton.vue';

import Arrow from "../../../../assets/svg/ico-arrow.svg?component";
import Check from '../../../../assets/svg/ico-check-transparency.svg?component';
import Deco from '../../../../assets/svg/card-corner.svg?component';

export default defineComponent({
  name: "TeacherGameView",
  components: {RoundButton, Arrow, Check, Deco},
  data() {
    return {
      publicPath: window.location.origin,
      value: 50,
      gameStore: useGameStore(),
    };
  },
  computed: {
    GAMESTEP() {
      return GAME_STEP;
    },
    COLOR() {
      return COLOR;
    },
    answers() {
      return this.gameStore.data.gameSequences[this.gameStore.currentSequence].gamemaster.answers;
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
        return "show";
      } else {
        if (this.playingTeams[index].isValidated) {
          AudioManagerInstance.play(AUDIO.GOOD_ANSWER_GROUP);
          return "validated";
        } else {
          return "hide";
        }
      }
    }
  },
});
</script>

<style scoped>
.box {
  box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
  transition: outline-offset 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}
</style>
