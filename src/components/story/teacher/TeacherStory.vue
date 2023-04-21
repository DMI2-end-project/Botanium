<template>
  <div class="bg-gray-100 flex p-6 text-black">
    <Reading/>
    <div class="flex flex-col">
      <button>Projection</button>
      <router-link :to="{ path: '/exercice/'+store.getFullGameId}">
        Lancer l'exercice {{ store.gameId }}
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {getSocket} from "../../../client";
import {EVENT} from "../../../common/Constants";
import {useMainStore} from "../../../stores/mainStore";
import Reading from "./Reading.vue";

export default defineComponent({
  name: 'TeacherStoryComponent',
  components: {Reading},
  data() {
    return {
      step: 0,
      socket: getSocket(),
      store: useMainStore()
    }
  },
  mounted() {
    console.log('store', this.store.getChapterId)
    this.socket.emit(EVENT.LAUNCH_STORY, {
      roomId: this.store.roomId,
      chapterId: this.store.getChapterId
    });
  }
});
</script>

<style lang="scss" scoped>

</style>
