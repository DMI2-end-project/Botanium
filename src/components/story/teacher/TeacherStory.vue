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
import {useStore} from "../../../stores/main";

export default defineComponent({
  name: 'TeacherStoryComponent',
  components: {},
  data() {
    return {
      socket: getSocket(),
      step: 0,
      store: useStore()
    }
  },
  mounted() {
    this.socket.emit(EVENT.LAUNCH_STORY, {
      roomId: this.store.roomId,
      gameId: this.store.getChapterId
    });
  }
});
</script>

<style lang="scss" scoped>

</style>
