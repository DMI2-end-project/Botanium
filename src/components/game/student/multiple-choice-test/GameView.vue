<template>
  <div class="relative grid grid-cols-12">
    <div class="col-start-2 col-span-10 grid grid-cols-2 gap-x-10 gap-y-12">
{{ answers}}
      <button v-for="(answer, index) in answers" :v-bind="index" :data-id="index" @click="itemSelected"
              class="bg-beige rounded-md shadow-md w-max-content h-full w-full p-20 flex flex-col items-center text-center text-green gap-5"
              :class="answer.status == 'error' ? 'bg-red-300' : (answer.status == 'valid' ? 'bg-green-300' : (answer.isClicked ? 'bg-gray-200' : 'bg-beige'))">
        <img :src="publicPath + '/src/assets/game-data/icons/'+ mainStore.getFullGameId +'/' + answer.icon" alt=""
             class="w-16 aspect-square pointer-events-none">
        <p class="mt-5 pointer-events-none">{{ answer.text }}</p>
      </button>
    </div>
    <button class="col-span-12 mx-auto my-5" @click="itemValidated">Valider</button>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import type {Answer} from '../../../../common/Interfaces'
import {useGameStore} from "../../../../stores/gameStore";

export default defineComponent({
  name: 'GameViewComponent',
  data() {
    return {
      publicPath: window.location.origin,
      gameStore: useGameStore(),
      currentAnswer: {} as Answer,
    }
  },
  computed: {
    answers() {
      if (this.gameStore.teamId) {
        console.log('this.gameStore.teamId', this.gameStore.teamId, this.gameStore.data.gameContent[this.gameStore.teamId].answers)
        return this.gameStore.data.gameContent[this.gameStore.teamId].answers
      }
    }
  },
  methods: {
    itemSelected(e: Event) {
      this.answers.forEach((answer: Answer) => {
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
      if (this.currentAnswer.status === 'valid') {
        setTimeout(() => {
          this.$emit('validated');
        }, 500)
      }
    }
  }
});
</script>

<style lang="scss" scoped>

</style>
