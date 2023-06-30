<template>
  <div class="relative grid grid-cols-2 auto-rows-fr gap-8 px-8 my-auto">
    <div v-for="(answer, index) in answers" :v-bind="index">
      <div class="relative p-2 aspect-[9/4] max-h-[25vh] max-w-[60vh]"
           :class="index % 2 === 0 ? 'ml-auto' : 'mr-auto'">
        <div class="!absolute top-0 left-0 w-full h-full">
          <CardSlot :answer-state="answer.status" class="w-full h-full"/>
        </div>
        <CardGame @click.native="() => itemSelected(index)"
                  mode="horizontal"
                  card-state="show" :answer-state="answer.status"
                  class="w-full h-full">
          <template v-slot:recto>
            <SvgIcon :name="answer.icon" class="w-16 aspect-square pointer-events-none"/>
            <span class="text-md pointer-events-none">{{ answer.text }}</span>
          </template>
        </CardGame>
      </div>
    </div>
  </div>
  <RoundButton @click="itemValidated" :color="COLOR.GREEN_LIGHT" class="col-span-2 mx-auto mt-4"
               :class="{'opacity-100 pointer-events-auto': currentIndex !== -1, 'opacity-30 pointer-events-none': currentIndex === -1}">
    <Check/>
  </RoundButton>
  <ModalView v-if="isModalOpen" @close="closeModal" :close="false" :click-outside="true">
    <h1>{{ congratTitle }}</h1>
    <p>{{ congratText }}</p>
    <RoundButton :color="COLOR.YELLOW" @click="closeModal">
      <Replay/>
    </RoundButton>
  </ModalView>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {useGameStore} from "../../../../stores/gameStore";
import {useMainStore} from "../../../../stores/mainStore";
import {shuffle} from "../../../../common/Lib";
import {COLOR} from "../../../../common/Constants";

import CardSlot from "../../CardSlot.vue";
import CardGame from "../../CardGame.vue";
import SvgIcon from "../../../common/SvgIcon.vue";
import ModalView from "../../../common/ModalView.vue";
import RoundButton from "../../../common/RoundButton.vue";

import Check from "../../../../assets/svg/ico-check.svg?component";
import Replay from "../../../../assets/svg/ico-replay.svg?component";

export default defineComponent({
  name: 'StudentGameView',
  components: {
    CardSlot,
    CardGame,
    Check,
    ModalView,
    Replay,
    RoundButton,
    SvgIcon
  },
  emits: ['validated'],
  data() {
    return {
      mainStore: useMainStore(),
      gameStore: useGameStore(),
      currentAnswer: undefined as any,
      currentIndex: -1,
      isModalOpen: false
    }
  },
  computed: {
    COLOR() {
      return COLOR
    },
    answers() {
      if (this.gameStore.teamId !== undefined) {
        const answers = this.gameStore.data.gameSequences[this.gameStore.currentSequence].teams[this.gameStore.teamId].answers;
        const shuffledAnswers = shuffle(answers);
        return shuffledAnswers;
      }
    },
    congratTitle() {
      if (this.gameStore.teamId !== undefined) {
        return this.gameStore.data.gameSequences[this.gameStore.currentSequence].teams[this.gameStore.teamId].congratulation?.title;
      }
    },
    congratText() {
      if (this.gameStore.teamId !== undefined) {
        return this.gameStore.data.gameSequences[this.gameStore.currentSequence].teams[this.gameStore.teamId].congratulation?.text;
      }
    }
  },
  mounted() {
    if (this.answers) {
      this.answers.forEach((answer: any) => {
        answer.status = "none";
      })
    }
  },
  methods: {
    itemSelected(index: number) {
      if (this.answers) {
        this.answers.forEach((answer: any) => {
          answer.status = "none";
        });
        this.answers[index].status = 'selected';
        this.currentIndex = index;
      }
    },
    itemValidated() {
      if (this.currentIndex !== -1 && this.answers) {
        this.answers[this.currentIndex].status = this.answers[this.currentIndex].isValid ? 'valid' : 'error';
        if (this.answers[this.currentIndex].status === 'valid') {
          setTimeout(() => {
            this.$emit('validated');
          }, 500);
        }
      }
    },
    closeModal() {
      setTimeout(() => {this.isModalOpen = false}, 600)
      this.mainStore.closeModal()
    }
  }
});
</script>
