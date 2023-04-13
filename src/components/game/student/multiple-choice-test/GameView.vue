<template>
  <div>
    <div class="flex flex-wrap justify-between items-center">
      <div v-for="(answer, index) in answers" :v-bind="index" class="w-1/2 p-5">
        <button class="w-max-content h-full w-full p-20 flex flex-col items-center" :data-id="index" :class="answer.status == 'error' ? 'bg-red-300' : (answer.status == 'valid' ? 'bg-green-300' : (answer.isClicked ? 'bg-gray-200' : 'bg-white'))" @click="itemSelected">
          <img :src="publicPath + '/src/assets' + answer.icon" alt="" class="w-10 h-10 pointer-events-none">
          <p class="mt-5 pointer-events-none">{{ answer.text }}</p>
        </button>
      </div>
      <button class="mx-auto my-5" @click="itemValidated">Valider</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import gameData from "../../../../assets/game-data/game-data.json";

export default defineComponent({
  name: 'GameViewComponent',
  props: {
    teamId: {
      type: String,
      default: "1",
    }
  },
  data () {
    return {
      publicPath: window.location.origin,
      answers: gameData[this.$route.params.id].gameContent[this.$props.teamId].answers,
      currentAnswer: null,
    }
  },
  methods: {
    itemSelected(e) {
      this.answers.forEach((answer: Object) => {
        answer.isClicked = false
        answer.status = ""
      });
      this.answers[e.target.dataset.id].isClicked = true
      this.currentAnswer = this.answers[e.target.dataset.id]
    },
    itemValidated() {
      this.currentAnswer.status = this.currentAnswer.isValid ? 'valid' : 'error'
      if (this.currentAnswer.status === 'valid') {
        setTimeout(() => { this.$emit('validated');  console.log('1')}, 500)
      }
    }
  }
});
</script>

<style lang="scss" scoped>

</style>
