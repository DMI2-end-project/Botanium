<template>
  <div class="bg-gray-100">
    <button>Lecture</button>
    <button>Projection</button>
    <router-link :to="{ path: '/exercice/'+store.getFullGameId}">
      Lancer l'exercice {{ store.gameId }}
    </router-link>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {getSocket} from "../../../client";
import {EVENT} from "../../../common/Constants";
import {useMainStore} from "../../../stores/mainStore";

export default defineComponent({
  name: 'TeacherStoryComponent',
  components: {},
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

    this.socket.on(EVENT.SEND_INSTRUCTION, async (arg) => {

    });
  }
});
</script>

<style lang="scss" scoped>

</style>
