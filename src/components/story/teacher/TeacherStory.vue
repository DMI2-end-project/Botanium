<template>
  <div class="bg-gray-100 flex p-6 text-black">
    <div v-show="storyStore.currentStep === STORYSTEP.INTRODUCTION || storyStore.currentStep === STORYSTEP.END"
         class="bg-beige rounded-md p-6">
      <h1>Chapitre {{ mainStore.chapterId }}</h1>
      <h2>Capucine Pinpin et les carottes</h2>
    </div>
    <Reading v-show="storyStore.currentStep === STORYSTEP.STORY" :data="$props.data"/>
    <RoundButton :color="COlOR.PINK" @click="next"> ></RoundButton>

    <!--div class="flex flex-col">
      <button>Projection</button>
      <button @click="launchGame">
        Lancer l'exercice {{ mainStore.gameId + 1 }}
      </button>
    </div-->
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {getSocket} from "../../../client";
import {COlOR, STORYSTEP} from "../../../common/Constants";
import {useMainStore} from "../../../stores/mainStore";
import {useGameStore} from "../../../stores/gameStore";
import Reading from "./Reading.vue";
import {GameMasterManagerInstance} from "./../../../common/GameMasterManager";
import RoundButton from "../../common/RoundButton.vue";
import {useStoryStore} from "../../../stores/storyStore";

export default defineComponent({
  name: 'TeacherStory',
  components: {RoundButton, Reading},
  props: {
    data: Object
  },
  data() {
    return {
      step: 0,
      socket: getSocket(),
      mainStore: useMainStore(),
      gameStore: useGameStore(),
      storyStore: useStoryStore(),
      GMIntsance: GameMasterManagerInstance
    }
  },
  computed: {
    COlOR() {
      return COlOR
    },
    STORYSTEP() {
      return STORYSTEP
    },
    totalParts() {
      return this.$props.data?.contents.length;
    },
    totalTexts() {
      return this.$props.data?.contents[this.storyStore.currentPart].length;
    }
  },
  methods: {
    next() {
      console.log('next', this.storyStore.currentText, this.totalTexts - 1)
      switch (this.storyStore.currentStep) {
        case STORYSTEP.INTRODUCTION:
          console.log('INTRO')
          this.storyStore.currentStep = STORYSTEP.STORY;
          break;
        case STORYSTEP.STORY:
          console.log('STORY')
          if (this.storyStore.currentText < this.totalTexts - 1) {
            this.storyStore.currentText += 1;
            break;
          } else {
            if (this.storyStore.currentPart < this.totalParts - 1) {
              this.GMIntsance.launchGame(this.mainStore.gameId + 1)
              break;
            } else {
              this.storyStore.currentStep = STORYSTEP.END;
              break;
            }
          }
        case STORYSTEP.END:
          this.GMIntsance.endStory();
      }
    }
  }
});
</script>
