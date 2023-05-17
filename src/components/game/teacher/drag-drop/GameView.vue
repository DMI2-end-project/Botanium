<template>
  <div >
    <p>Drag drop</p>
    <button v-show="gameStore.currentStep === STEP.END" class="col-span-12 mx-auto my-5" @click="next">
      Continuer
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {useGameStore} from "../../../../stores/gameStore";
import { STEP } from "../../../../common/Constants";
import {GameMasterManagerInstance} from "../../../../common/GameMasterManager";

// TODO : DYNAMIC SVG
export default defineComponent({
  name: "TeacherGameView",
    data() {
    return {
      gameStore: useGameStore(),
    }
  },
  computed: {
    STEP() {
      return STEP
    },
  },
  methods: {
      next() {
          GameMasterManagerInstance.endGame()
      },
  },
});
</script>
