<template>
  <SelectedVideoCopy @select="isValid" :element="element" :isError="isError" :isCorrect="isCorrect"/>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {useGameStore} from "../../../../stores/gameStore";
import {AUDIO, COLOR} from "../../../../common/Constants";
import {AudioManagerInstance} from "../../../../common/AudioManager";
import SelectedVideoCopy from './SelectedVideo.vue';

export default defineComponent({
  name: "StudentGameView",
  components: {
    SelectedVideoCopy
  },
  emits: ['validated'],
  data() {
    return {
      gameStore: useGameStore(),
      isError: false,
      isCorrect: false
    }
  },
  computed: {
    COLOR() {
      return COLOR;
    },
    element() {
      if (this.gameStore.teamId !== undefined) {
        return this.gameStore.data.gameSequences[this.gameStore.currentSequence].teams[this.gameStore.teamId].element;
      }
    }
  },
  methods: {
    isValid(value: number) {
      if (this.gameStore.teamId !== undefined) {
        if (value === this.gameStore.data.gameSequences[this.gameStore.currentSequence].teams[this.gameStore.teamId].answers) {
          this.isCorrect = true;
          AudioManagerInstance.play(AUDIO.GOOD_ANSWER_GROUP_TABLET);
          setTimeout(() => {
            this.$emit('validated');
          }, 1200)
        } else {
          this.isError = true
          AudioManagerInstance.play(AUDIO.WRONG_ANSWER_GROUP_TABLET, 0.2);
          setTimeout(() => {
            this.isError = false
          }, 600)
        }
      }
    }
  }
});
</script>
