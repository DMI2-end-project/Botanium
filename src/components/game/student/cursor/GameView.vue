<template>
  <div>
    <SelectedVideoCopy @select="isValid" :element="element" :isError="isError" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useGameStore } from "../../../../stores/gameStore";
import {COLOR} from "../../../../common/Constants";
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
      isError: false
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
          this.$emit('validated');
        } else {
          this.isError = true
          setTimeout(() => {
            this.isError = false
          }, 600)
        }
      }
    }
  }
});
</script>
