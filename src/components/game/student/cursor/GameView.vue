<template>
  <div>
    <SelectedVideoCopy @select="isValid" :element="element" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useGameStore } from "../../../../stores/gameStore";
import {COlOR} from "../../../../common/Constants";
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
    }
  },
  computed: {
    COlOR() {
      return COlOR;
    },
    element() {
      if (this.gameStore.teamId !== undefined) {
        return this.gameStore.data.gameSequences[this.gameStore.currentSequence].teams[this.gameStore.teamId].element;
      }
    }
  },
  methods: {
    isValid(value: number) {
      if (value === this.gameStore.data.gameSequences[this.gameStore.currentSequence].teams[this.gameStore.teamId].answers) {
        this.$emit('validated');
      }
    }
  }
});
</script>
