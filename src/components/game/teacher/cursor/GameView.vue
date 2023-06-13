<template>
  <div class="w-3/4 mx-auto">
    <div class="flex justify-around gap-24">
      <div v-for="(team, index) in playingTeams" :v-bind="index" class="box relative flex-1 max-w-[20vw] h-[15vw] outline-2 outline-dashed outline-white rounded-lg  flex flex-col items-center justify-center" :class="cardState(index) === 'validated' ? 'bg-green' : 'bg-yellow' + (cardState(index) === 'show' ? '-outline-offset-2' : 'outline-offset-8')">
        <img alt="" :src="publicPath + '/game/images/00103/' + answers[index].image" class="grayscale brightness-50 w-2/5 opacity-30">
        <div class="absolute w-full h-full bg-beige flex flex-col items-center justify-center outline-1 outline outline-beige-dark rounded-lg -outline-offset-8 transform transition-all duration-1000 delay-100" :class="cardState(index) === 'show' ? 'scale-100 translate-y-0 opacity-1' : 'scale-110 -translate-y-14 opacity-0'">
          <img alt="" :src="publicPath + '/game/images/00103/' + answers[index].image" class="w-2/5">
        </div>
      </div>
    </div>
    <RoundButton v-show="gameStore.currentStep === GAMESTEP.END" :color="COLOR.GREEN" class="mx-auto mt-4" @click="next">
      <Arrow class="rotate-180" />
    </RoundButton>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {useGameStore} from "../../../../stores/gameStore";
import { GAME_STEP, COLOR } from "../../../../common/Constants";
import { GameMasterManagerInstance } from "../../../../common/GameMasterManager";
import RoundButton from '../../../common/RoundButton.vue';
import Arrow from "../../../../assets/svg/ico-arrow.svg?component";


export default defineComponent({
  name: "TeacherGameView",
  components: { RoundButton, Arrow },
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
            }
            else {
                if (this.playingTeams[index].isValidated) {
                    return "validated";
                }
                else {
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
