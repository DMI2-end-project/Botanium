<template>
  <main class="w-full h-full">
    <div class="flex flex-col w-full h-full p-4 z-20">
      <div>
        Path : {{ router.currentRoute.path }},
        Auth state : {{ pb.authStore.isValid }},
        Role : {{ mainStore.role }}
      </div>
      <div>
        Socket state : {{ mainStore.connected }},
        RoomID : {{ mainStore.roomId }},
        TeamID : {{ gameStore.teamId }},
        Step : {{ gameStore.currentStep }}
      </div>
      <button @click="disconnect" class="ml-auto block">Déconnexion</button>
    </div>
    <!--The <slot> element is a slot outlet that indicates where the "VIEW" content should be rendered.-->
    <slot></slot>
  </main>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {useRouter} from "vue-router";
import {getSocket} from "../client";
import {useMainStore} from "../stores/mainStore";
import {DatabaseManagerInstance} from "../common/DatabaseManager";
import {useGameStore} from "../stores/gameStore";


export default defineComponent({
  name: 'TheDevLayout',
  data() {
    return {
      mainStore: useMainStore(),
      gameStore: useGameStore(),
      router: useRouter(),
      socket: getSocket(),
      pb: DatabaseManagerInstance.pb
    }
  },
  mounted() {
    console.log('router', this.router)
  },
  methods: {
    DatabaseManagerInstance() {
      return DatabaseManagerInstance
    },
    disconnect() {
      this.socket.disconnect();
      this.pb.authStore.clear();
      this.mainStore.reset();
      this.gameStore.reset();
      this.router.push({
        name: 'Login'
      });
    }
  }
});
</script>

<style lang="scss" scoped>

</style>
