<template>
  <header class="flex items-center justify-between fixed z-50 w-full p-4">
    <RoundButton :color="COLOR.YELLOW" @click="router.push({name: 'Dashboard'})"><Home /></RoundButton>
    <Info text="Ajoute une page au carnet de bord pour commencer !"><Speaker /></Info>
    <button @click="disconnect" class="block">Déconnexion</button>
  </header>
  <main class="w-screen h-screen bg-green-medium">

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
import { useGameStore } from "../stores/gameStore";
import RoundButton from "../components/common/RoundButton.vue";
import Info from "../components/common/Info.vue";
import { COLOR } from "../common/Constants";
import Home from "../assets/svg/ico-home.svg?component";
import Speaker from "../assets/svg/ico-speaker.svg?component";

export default defineComponent({
  name: 'LogBookLayout',
  components: {
    RoundButton,
    Info,
    Home,
    Speaker
  },
  data() {
    return {
      mainStore: useMainStore(),
      gameStore: useGameStore(),
      router: useRouter(),
      socket: getSocket(),
      pb: DatabaseManagerInstance.pb
    }
  },
  computed: {
    COLOR() {
      return COLOR
    }
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
