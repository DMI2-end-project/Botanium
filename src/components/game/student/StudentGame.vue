<template>
  <div>
    <component v-bind:is="GameView" @validated="validated" @openModal="open"/>
    <ModalView v-if="isModalOpen" @close="close" :close="false" :click-outside="true">
      <h1>{{ teamData.congratulation?.title }}</h1>
      <p>{{ teamData.congratulation?.text }}</p>
      <RoundButton :color="COLOR.GREEN_MEDIUM_BEIGE" @click="close">
        <Check/>
      </RoundButton>
    </ModalView>
  </div>
</template>

<script lang="ts">
import {Component, defineComponent} from 'vue';
import {getSocket} from "../../../client";
import {useGameStore} from "../../../stores/gameStore";
import {useMainStore} from "../../../stores/mainStore";
import {COLOR, GAME_STEP, GAME_TYPE} from "../../../common/Constants";
import {TeamManagerInstance} from "../../../common/TeamManager";

import Cursor from "./cursor/GameView.vue";
import DragDrop from "./drag-drop/GameView.vue";
import MCQ from "./multiple-choice-test/GameView.vue";
import ModalView from "../../common/ModalView.vue";
import Rhythm from "./rhythm/GameView.vue";
import RoundButton from "../../common/RoundButton.vue";
import Swipe from "./swipe/GameView.vue";

import Check from "../../../assets/svg/ico-check.svg?component";

interface TeamData {
  congratulation: any
}

export default defineComponent({
  name: 'StudentGame',
  components: {
    Check,
    Cursor,
    DragDrop,
    MCQ,
    ModalView,
    Rhythm,
    RoundButton,
    Swipe
  },
  data() {
    return {
      socket: getSocket(),
      mainStore: useMainStore(),
      gameStore: useGameStore(),
      isModalOpen: false,
    }
  },
  emits: ["validated", "openModal"],
  computed: {
    COLOR() {
      return COLOR
    },
    GAMESTEP() {
      return GAME_STEP
    },
    teamData() {
      return this.gameStore.data.gameSequences[this.gameStore.currentSequence].teams[this.gameStore.teamId ? this.gameStore.teamId : 0];
    },
    GameView(): Component | undefined {
      let currentPart = this.gameStore.data?.gameSequences[this.gameStore.currentSequence];
      if (currentPart) {
        switch (currentPart.type) {
          case GAME_TYPE.DRAG_DROP:
            return DragDrop;
          case GAME_TYPE.MCQ:
            return MCQ;
          case GAME_TYPE.RHYTHM:
            return Rhythm;
          case GAME_TYPE.SWIPE:
            return Swipe;
          case GAME_TYPE.CURSOR:
            return Cursor;
          default:
          //return;
        }
      }
    }
  },
  methods: {
    async validated() {
      this.$emit('validated');
      this.gameStore.currentStep = GAME_STEP.WAIT;
      await TeamManagerInstance.teamValidation();
    },
    /*
    async validated() {
      console.log('validated', this.gameStore.currentStep, this.gameStore.data.gameSequences.length, this.gameStore.currentStep < this.gameStore.data.gameSequences.length)
      if (this.gameStore.currentStep < this.gameStore.data.gameSequences.length) {
        this.isModalOpen = true;
        this.mainStore.isModalOpen = true;
        //this.gameStore.currentSequence += 1;
        await this.TMInstance.nextSequence();
      } else {
        console.log('we in ?')
        //this.$emit('validated');
        this.gameStore.currentStep = GAME_STEP.WAIT;
        await TeamManagerInstance.teamValidation();
      }
    },
     */
    open() {
      this.isModalOpen = true;
      this.mainStore.isModalOpen = true;
    },
    async close() {
      this.isModalOpen = false;
      this.mainStore.isModalOpen = false;
      this.gameStore.currentSequence += 1;
      await TeamManagerInstance.nextSequence();
    }
  }
});
</script>

<style lang="scss" scoped>

</style>
