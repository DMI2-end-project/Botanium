<template>
  <div class="relative flex flex-col items-center text-center my-auto">
    <div class="flex flex-col items-center">
      <SignboardVue :text="'Enigme n°' + mainStore.gameId" class="z-10" />
      <SignboardVue :text="title" :is-rotate="true" class="text-purple min-w-[25vw] -mt-3" />
    </div>
    <div class="w-full flex flex-col items-center gap-6 bg-green rounded-md p-10 -mt-6">
      <h3 class="text-beige">{{ text }}</h3>
    </div>
    <p v-if="mainStore.role === ROLE.TEACHER && microNeeded && !hasMicroOn && !hasMicroWaiting" class="mt-6">Attention : Aucune équipe n'a activé son micro, l'exercice ne pourra donc pas être réalisé.</p>
    <RoundButton v-if="mainStore.role === ROLE.TEACHER" @click="next" :color="COLOR.PINK" class="mt-8 text-lg font-bold" :is-active="mainStore.role === ROLE.TEACHER && ((microNeeded && !hasMicroWaiting) || !microNeeded)">
      <Arrow class="rotate-180"/>
    </RoundButton>
    <CircleButton v-if="mainStore.role === ROLE.STUDENT && microNeeded && !hasMicro" @click="getMicrophone" class="mt-10" text="Allume ton micro" :color="COLOR.PURPLE" :size="SIZE.MD" :colorReverse="true"><MicroOn /></CircleButton>
    <RoundItem v-else-if="mainStore.role === ROLE.STUDENT && microNeeded && hasMicro" class="-mt-10" :color="COLOR.GREEN_MEDIUM"><Check /></RoundItem>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {useMainStore} from "../../stores/mainStore";
import {useGameStore} from "../../stores/gameStore";
import { COLOR, ROLE, SIZE } from "../../common/Constants";
import { GameMasterManagerInstance } from "../../common/GameMasterManager";

import SignboardVue from "../common/Signboard.vue";
import RoundButton from "../common/RoundButton.vue";
import CircleButton from "../common/CircleButton.vue";
import RoundItem from "../common/RoundItem.vue";

import MicroOn from "./../../assets/svg/ico-micro-on.svg?component";
import Check from "./../../assets/svg/ico-check.svg?component";
import Arrow from "./../../assets/svg/ico-arrow.svg?component";

export default defineComponent({
  name: 'InstructionComponent',
  components: {SignboardVue, RoundButton, CircleButton, RoundItem, MicroOn, Check, Arrow},
  emits: ['getMicrophone'],
  data() {
    return {
      mainStore: useMainStore(),
      gameStore: useGameStore(),
    }
  },
  computed: {
    COLOR() {
      return COLOR
    },
    SIZE() {
      return SIZE
    },
    ROLE() {
      return ROLE
    },
    title() {
      return this.gameStore.data?.introduction.title
    },
    text() {
      return this.gameStore.data?.introduction.text
    },
    microNeeded() {
      return this.gameStore.data.gameSequences[this.gameStore.currentSequence].microNeeded
    },
    hasMicro() {
      const team = this.gameStore.teams.find(team => team._name === this.gameStore.teamName)
      if (team) {
        return team?.hasMicro
      } else {
        return false
      }
    },
    hasMicroWaiting() {
      const teams = this.gameStore.teams.filter(team => team.hasMicro === null)
      if (teams) {
        return teams.length >= 1
      } else {
        return true
      }
    },
    hasMicroOn() {
      const teams = this.gameStore.teams.filter(team => team.hasMicro)
      if (teams) {
        return teams.length >= 1
      } else {
        return false
      }
    }
  },
  methods: {
    next() {
      GameMasterManagerInstance.startGame()
    },
    getMicrophone() {
      this.$emit('getMicrophone');
    }
  }
});
</script>
