<template>
  <div class="bg-gray-100 flex p-6 text-black">
    <Reading/>
    <div class="flex flex-col">
      <button>Projection</button>
      <router-link :to="{ path: '/exercice/'+mainStore.getFullGameId}">
        Lancer l'exercice {{ mainStore.gameId }}
      </router-link>
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
  mounted() {
    console.log('chapterId', this.mainStore.getChapterId)
    this.socket.emit(EVENT.LAUNCH_STORY, {
      roomId: this.mainStore.roomId,
      chapterId: this.mainStore.getChapterId
    });
  }
});
</script>

<style lang="scss" scoped>

</style>
