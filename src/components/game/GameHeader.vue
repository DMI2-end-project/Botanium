<template>
  <div class="relative grid grid-cols-12 gap-4 px-8">
    <div class="absolute top-2 left-2 text-xl">
      <RoundItem :color="COLOR.YELLOW" :isEnigma="true">
        <component :is="getNumberComponent(mainStore.gameId)"/>
      </RoundItem>
    </div>
    <p class="col-start-3 col-span-8 bg-green text-beige text-center leading-tight py-7 px-8 rounded-md">{{ text }}</p>
    <RoundButton v-show="mainStore.role === ROLE.STUDENT && clue && clue !== ''" @click="openModal"
                 class="col-start-12 ml-auto">
      <Clue/>
    </RoundButton>
  </div>

  <ModalView v-if="isModalOpen">
    <h1>Indice :</h1>
    <p>{{ clue }}</p>
    <RoundButton @click="closeModal" :color="COLOR.GREEN_MEDIUM_BEIGE">
      <Check/>
    </RoundButton>
  </ModalView>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {useGameStore} from "../../stores/gameStore";
import {useMainStore} from "../../stores/mainStore";
import {ROLE, COLOR, SIZE} from "../../common/Constants";
import RoundItem from "../common/RoundItem.vue";
import RoundButton from "../common/RoundButton.vue";
import ModalView from "../common/ModalView.vue";

import Check from "./../../assets/svg/ico-check.svg?component";
import Clue from "./../../assets/svg/ico-interrogation.svg?component";

import ZERO from "./../../assets/svg/numbers/0.svg?component";
import ONE from "./../../assets/svg/numbers/1.svg?component";
import TWO from "./../../assets/svg/numbers/2.svg?component";
import THREE from "./../../assets/svg/numbers/3.svg?component";
import FOUR from "./../../assets/svg/numbers/4.svg?component";
import FIVE from "./../../assets/svg/numbers/5.svg?component";
import SIX from "./../../assets/svg/numbers/6.svg?component";
import SEVEN from "./../../assets/svg/numbers/7.svg?component";
import EIGHT from "./../../assets/svg/numbers/8.svg?component";
import NINE from "./../../assets/svg/numbers/9.svg?component";

interface TeamData {
  [key: string]: any;
}

export default defineComponent({
  name: 'GameHeader',
  components: {
    RoundItem,
    RoundButton,
    ModalView,
    Check,
    Clue,
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
      return this.gameStore.data?.gameSequences[this.gameStore.currentSequence];
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
      let index = this.gameStore.teamId ? this.gameStore.teamId : 0
      return this.gameStore.data?.gameSequences[this.gameStore.currentSequence].teams[index].clue;
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
    },
    getNumberComponent(number: number) {
      // TODO : to improve for numbers > 9
      switch (number) {
        case 1:
          return ONE;
          break;
        case 2:
          return TWO;
          break;
        case 3:
          return THREE;
          break;
        case 4:
          return FOUR;
          break;
      }
    }
  }
});
</script>

<style lang="scss" scoped>

</style>
