<template>
  <div class="relative grid grid-cols-12 gap-4 px-8">
    <div class="absolute top-2 left-2 text-xl">
      <RoundItem :color="COLOR.YELLOW" :isEnigma="true">
        {{ mainStore.gameId }}
      </RoundItem>
    </div>
    <p class="col-start-3 col-span-8 bg-green text-beige text-center leading-tight py-7 px-8 rounded-md">{{ text }}</p>
    <RoundButton v-show="mainStore.role === ROLE.STUDENT && clue && clue !== ''" @click="openModal" class="col-start-12 ml-auto">?</RoundButton>
  </div>

   <ModalView v-if="isModalOpen">
    <div class="relative my-2 flex flex-col items-center">
      <h1 class="mt-8">Indice :</h1>
      <p class="my-8">{{ clue }}</p>
      <RoundButton @click="closeModal" :color="COLOR.GREEN_MEDIUM_BEIGE"><Check /></RoundButton>
    </div>
  </ModalView>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {useGameStore} from "../../stores/gameStore";
import {useMainStore} from "../../stores/mainStore";
import { ROLE, COLOR, SIZE } from "../../common/Constants";
import RoundItem from "../common/RoundItem.vue";
import RoundButton from "../common/RoundButton.vue";
import ModalView from "../common/ModalView.vue";
import Check from "./../../assets/svg/ico-check.svg?component";

export default defineComponent({
  name: 'GameHeader',
  components: {
    RoundItem,
    RoundButton,
    ModalView,
    Check
  },
  data() {
    return {
      mainStore: useMainStore(),
      gameStore: useGameStore(),
      publicPath: window.location.origin,
      isModalOpen: false,
    }
  },
  computed: {
    ROLE() {
      return ROLE
    },
    COLOR() {
      return COLOR
    },
    SIZE() {
      return SIZE
    },
    currentSection() {
      return this.gameStore.data?.gameSequences[this.gameStore.currentSequence]
    },
    text() {
      if (this.gameStore.teamId !== undefined) {
        let index = this.currentSection.teamsNeeded ? this.gameStore.teamId : 0;
        return this.currentSection.teams[index].instruction;
      } else {
        return this.currentSection.gamemaster?.instruction;
      }
    },
    clue() {
      return this.gameStore.data?.gameSequences[this.gameStore.currentSequence].teams[this.gameStore.teamId].clue
    }
  },
  methods: {
    openModal() {
      this.mainStore.isModalOpen = true;
      this.isModalOpen = true;
    },
    closeModal() {
      this.mainStore.isModalOpen = false;
      this.isModalOpen = false;
    }
  }
});
</script>

<style lang="scss" scoped>

</style>
