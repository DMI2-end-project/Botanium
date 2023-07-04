<template>
  <div class="relative grid grid-cols-12 items-center gap-4 px-8">
    <!-- absolute top-2 left-2 -->
    <div class="col-span-2 text-xl">
      <RoundItem :color="COLOR.YELLOW" :isEnigma="true" class="mx-auto">
        <component :is="getNumberComponent(mainStore.gameId)"/>
      </RoundItem>
    </div>
    <p class="col-start-3 col-span-8 lg:col-start-3 lg:col-span-8 bg-green text-beige text-center leading-tight py-7 px-8 rounded-md">
      {{ text }}</p>

    <div class="col-span-2">
      <RoundButton v-show="mainStore.role === ROLE.STUDENT && clue && clue !== ''" @click="openModal"
                   class="relative mx-auto" :number="2">
        <Clue class="relative z-10"/>
        <template #animation>
          <div ref="clue" class="absolute bg-pink rounded-full w-full aspect-square top-0 left-0 -z-10"/>
        </template>
      </RoundButton>
    </div>
  </div>

  <ModalView v-if="isModalOpen" @close="closeModal" :close="false" :click-outside="true">
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
      timeoutID: setTimeout(() => {
      })
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
      if (this.gameStore.data) {
        let index = this.gameStore.currentSequence ? this.gameStore.currentSequence : 0
        return this.gameStore.data?.gameSequences[index];
      }
    },
    text() {
      if (this.currentSection) {
        if (this.gameStore.teamId !== undefined) {
          let index = this.currentSection.teamsNeeded ? this.gameStore.teamId : 0;
          return this.currentSection.teams[index].instruction;
        } else {
          return this.currentSection.gamemaster?.instruction;
        }
      }
      return '';
    },
    clue() {
      let index = this.gameStore.teamId ? this.gameStore.teamId : 0
      if (this.gameStore.data && this.gameStore.currentSequence !== null && this.gameStore.data?.gameSequences[this.gameStore.currentSequence].teams) {
        this.timeoutID = setTimeout(() => {
          if (this.$refs.clue) {
            (this.$refs.clue as HTMLDivElement).classList.add('animate-ping');
          }
        }, 60000);
        return this.gameStore.data?.gameSequences[this.gameStore.currentSequence].teams[index].clue;
      }
    }
  },
  methods: {
    openModal() {
      this.mainStore.openModal()
      this.isModalOpen = true;
    },
    closeModal() {
      this.mainStore.closeModal()
      setTimeout(() => {this.isModalOpen = false}, 600)
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
  },
  watch: {
    clue(newClue, _) {
      if (newClue) {
        this.timeoutID = setTimeout(() => {
          (this.$refs.clue as HTMLDivElement).classList.add('animate-ping');
        }, 10000);
      } else {
        clearTimeout(this.timeoutID);
      }
    }
  }
});
</script>

<style lang="scss" scoped>

</style>
