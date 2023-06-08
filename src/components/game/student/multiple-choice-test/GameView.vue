<template>
  <div class="relative grid grid-cols-2 auto-rows-fr gap-4 px-8 my-auto">
    <CardGame v-for="(answer, index) in answers" :v-bind="index" @click.native="() => itemSelected(index)"
              card-state="show" :answer-state="answer.status"
              class="aspect-[9/4]">
      <template v-slot:recto>
        <SvgIcon :name="answer.icon" class="w-16 aspect-square pointer-events-none"/>
        <span class="text-md pointer-events-none">{{ answer.text }}</span>
      </template>
    </CardGame>
    <!--div v-for="(answer, index) in answers" :v-bind="index" class="w-full border rounded-md p-3.5"
         :class="answer.isClicked ? 'border-green-light' : 'border-transparent'">
      <button @click="itemSelected" :data-id="index"
              class="w-full h-full rounded-md shadow-md w-max-content flex flex-col items-center gap-5 text-center py-14 px-10 focus:outline-none "
              :class="answer.status === 'error' ? '!bg-red text-white' : (answer.status === 'valid' ? '!bg-blue text-white' : (answer.isClicked ? '!bg-green-light text-green' : '!bg-beige text-green'))">
        <img :src="publicPath + '/src/assets/game-data/icons/'+ mainStore.getFullGameId +'/' + answer.icon" alt=""
             class="w-16 aspect-square pointer-events-none">
        <span class="text-md pointer-events-none">{{ answer.text }}</span>
      </button>
    </div-->
    <RoundButton @click="itemValidated" :color="COLOR.GREEN_LIGHT" class="col-span-2 mx-auto my-5"
                 :class="{'opacity-100 pointer-events-auto': currentIndex !== -1, 'opacity-30 pointer-events-none': currentIndex === -1}">
      <Check/>
    </RoundButton>
    <ModalView v-if="isModalOpen">
      <h1>{{ teamData.congratulation?.title }}</h1>
      <p>{{ teamData.congratulation?.text }}</p>
      <RoundButton :color="COLOR.YELLOW" @click="close">
        <Replay/>
      </RoundButton>
    </ModalView>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {useGameStore} from "../../../../stores/gameStore";
import {useMainStore} from "../../../../stores/mainStore";
import {COLOR} from "../../../../common/Constants";

import CardGame from "../../CardGame.vue";
import SvgIcon from "../../../common/SvgIcon.vue";
import ModalView from "../../../common/ModalView.vue";
import RoundButton from "../../../common/RoundButton.vue";

import Check from "../../../../assets/svg/ico-check.svg?component";
import Replay from "../../../../assets/svg/ico-replay.svg?component";

export default defineComponent({
  name: 'StudentGameView',
  components: {
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
      publicPath: window.location.origin,
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
        return this.gameStore.data.gameSequences[this.gameStore.currentSequence].teams[this.gameStore.teamId].answers;
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
      this.answers.forEach((answer: any) => {
        answer.status = "none";
      });
      this.answers[index].status = 'selected';
      this.currentIndex = index;
    },
    itemValidated() {
      if (this.currentIndex !== -1) {
        this.answers[this.currentIndex].status = this.answers[this.currentIndex].isValid ? 'valid' : 'error';
        if (this.answers[this.currentIndex].status === 'valid') {
          setTimeout(() => {
            this.$emit('validated');
          }, 500);
        }
      }
    },
    closeModal() {
      this.isModalOpen = false;
      this.mainStore.isModalOpen = false;
    }
  }
});
</script>


