<template>
  <header class="flex items-center justify-between fixed z-50 w-full p-4">
    <RoundButton v-if="!logBookStore.isClosable" :color="COLOR.YELLOW" @click="router.push({name: mainStore.role === ROLE.STUDENT ? 'Home' : 'Dashboard'})"><Home /></RoundButton>
    <RoundButton v-if="logBookStore.isClosable" :color="COLOR.RED" @click="closeElements"><Cross /></RoundButton>
    <Info text="Ajoute une page au carnet de bord pour commencer !"><Speaker /></Info>
  </header>
  <main class="w-screen h-screen bg-cover bg-texture-green">

    <!--The <slot> element is a slot outlet that indicates where the "VIEW" content should be rendered.-->
    <slot></slot>
  </main>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {useRouter} from "vue-router";
import {getSocket} from "../client";
import {useMainStore} from "../stores/mainStore";
import {useLogBookStore} from "../stores/logBookStore";
import {DatabaseManagerInstance} from "../common/DatabaseManager";
import { useGameStore } from "../stores/gameStore";
import RoundButton from "../components/common/RoundButton.vue";
import Info from "../components/common/Info.vue";
import { COLOR, ROLE } from "../common/Constants";
import Home from "../assets/svg/ico-home.svg?component";
import Speaker from "../assets/svg/ico-speaker.svg?component";
import Cross from "../assets/svg/ico-cross.svg?component";

export default defineComponent({
  name: 'LogBookLayout',
  components: {
    RoundButton,
    Info,
    Home,
    Speaker,
    Cross
  },
  data() {
    return {
      mainStore: useMainStore(),
      logBookStore: useLogBookStore(),
      router: useRouter(),
    }
  },
  computed: {
    COLOR() {
      return COLOR
    },
    ROLE() {
      return ROLE
    }
  },
  methods: {
    DatabaseManagerInstance() {
      return DatabaseManagerInstance
    },
    closeElements() {
      this.logBookStore.closeElements = true
      this.logBookStore.isClosable = false
    }
  }
});
</script>

<style lang="scss" scoped>

</style>
