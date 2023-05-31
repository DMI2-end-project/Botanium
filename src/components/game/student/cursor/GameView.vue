<template>
  <div >
    <p>Cursor</p>
    <SelectedVideoCopy @select="isValid" />
    <button @click="$emit('validated');">Reussi</button>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import { GameMasterManagerInstance } from "../../../../common/GameMasterManager";
import SelectedVideoCopy from './SelectedVideo.vue';

export default defineComponent({
  name: "StudentGameView",
  components: {
    SelectedVideoCopy
  },
  methods: {
    isValid(value:number) {
      console.log('Value selected : ' + value)
    }
  }
});
</script>
