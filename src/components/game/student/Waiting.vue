<template>
  <div>
    <div class="flex flex-col justify-between items-center bg-gray-200 p-10">
      <div class="rounded-full bg-white p-5">
        <img :src="publicPath + '/src/assets' + icon" alt="" class="w-16 h-16">
      </div>
      <p class="mt-5 uppercase font-bold">Bravo !</p>
      <p>C’est la bonne réponse</p>
      <p class="">{{ text }}</p>
      <div class="bg-white mt-10 p-5 rounded-xl"><p>{{ waitingMessage }}</p></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'WaitingComponent',
  props: {
    teamId: {
      type: String,
      default: "1",
    },
    gameData: {
      type: Object,
      default: {},
    }
  },
  data () {
    return {
      publicPath: window.location.origin as string,
      text: this.gameData[this.$route.params.id as string].gameContent[this.$props.teamId].congratulation,
      icon: this.gameData[this.$route.params.id as string].gameContent[this.$props.teamId].congratulationIcon,
      waitingMessage: this.gameData[this.$route.params.id as string].waitingMessage
    }
  },
  mounted() {
    console.log(this.gameData[this.$route.params.id as string].gameContent[this.$props.teamId])
  }
});
</script>

<style lang="scss" scoped>

</style>
