<template>
  <div class="bg-gray-100 flex p-6 text-black">
    <Reading/>
    <div class="flex flex-col">
      <button>Projection</button>
      <button @click="launchGame">
        Lancer l'exercice {{ mainStore.gameId + 1 }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {getSocket} from "../../../client";
import {EVENT} from "../../../common/Constants";
import {useMainStore} from "../../../stores/mainStore";
import {useGameStore} from "../../../stores/gameStore";
import Reading from "./Reading.vue";
import {GameMasterManagerInstance} from "./../../../common/GameMasterManager";

export default defineComponent({
  name: 'TeacherStoryComponent',
  components: {Reading},
  data() {
    return {
      step: 0,
      socket: getSocket(),
      mainStore: useMainStore(),
      gameStore: useGameStore()
    }
  },
  methods: {
    launchGame() {
      GameMasterManagerInstance.launchGame(this.mainStore.gameId + 1);
    }
  }
});
</script>

<style lang="scss" scoped>

</style>
