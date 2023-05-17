<template>
  <div class="relative grid grid-cols-12 gap-6">
    <div class="col-start-2 col-span-10 grid grid-cols-2 gap-4">
      <div v-for="(answer, index) in answers" :v-bind="index" class="w-full border rounded-md p-3.5"
           :class="answer.isClicked ? 'border-green-light':'border-transparent'">
        <button @click="itemSelected" :data-id="index"
                class="w-full h-full rounded-md shadow-md w-max-content flex flex-col items-center gap-5 text-center py-14 px-10 focus:outline-none "
                :class="answer.status === 'error' ? '!bg-red text-white' : (answer.status === 'valid' ? '!bg-blue text-white' : (answer.isClicked ? '!bg-green-light text-green' : '!bg-beige text-green'))">
          <img :src="publicPath + '/src/assets/game-data/icons/'+ mainStore.getFullGameId +'/' + answer.icon" alt=""
               class="w-16 aspect-square pointer-events-none">
          <span class="text-md pointer-events-none">{{ answer.text }}</span>
        </button>
      </div>
    </div>
    <RoundButton @click="itemValidated" :color="COLOR.GREEN"/> <!-- :icon="Check" -->
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {useGameStore} from "../../../../stores/gameStore";
import {useMainStore} from "../../../../stores/mainStore";
import {COLOR} from "../../../../common/Constants";
import RoundButton from "../../../common/RoundButton.vue";

//import Check from "../../../../assets/svg/ico-check-transparency.svg?component";

export default defineComponent({
  name: 'StudentGameView',
  components: {RoundButton},
  data() {
    return {
      publicPath: window.location.origin,
      mainStore: useMainStore(),
      gameStore: useGameStore(),
      currentAnswer: {} as any,
    }
  },
  computed: {
    COLOR() {
      return COLOR
    },
    answers() {
      if (this.gameStore.teamId !== undefined) {
        return this.gameStore.data.gameSequences[this.gameStore.currentSequence].teams[this.gameStore.teamId].answers
        //return this.gameStore.data.gameContent[this.gameStore.teamId].answers;
      }
    }
  },
  mounted() {
    if (this.answers) {
      this.answers.forEach((answer: any) => {
        answer.isClicked = false;
        answer.status = "";
      })
    }
  },
  methods: {
    itemSelected(e: Event) {
      this.answers.forEach((answer: any) => {
        answer.isClicked = false;
        answer.status = "";
      });
      const target = e.target as HTMLElement;
      if (target.dataset?.id != null) {
        this.answers[target.dataset.id].isClicked = true;
        this.currentAnswer = this.answers[target.dataset.id];
      }
    },
    itemValidated() {
      this.currentAnswer.status = this.currentAnswer.isValid ? 'valid' : 'error';
      this.currentAnswer.isClicked = false;
      if (this.currentAnswer.status === 'valid') {
        setTimeout(() => {
          this.$emit('validated');
        }, 500)
      }
    }
  }
});
</script>

<script setup lang="ts">
</script>
