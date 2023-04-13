<template>
  <div class="bg-gray-100">
    <Instruction v-if="step === 0" />
    <InGame v-if="step === 1" :teamId="teamId" @validated="validated" />
    <Waiting v-if="step === 2" :teamId="teamId" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Instruction from "./../Instruction.vue";
import InGame from "./InGame.vue";
import Waiting from "./Waiting.vue";

export default defineComponent({
  name: 'InGameComponent',
  components: {
    Instruction,
    InGame,
    Waiting
  },
  props: {
    teamId: {
      type: String,
      default: "1",
    }
  },
  data () {
    return {
      step: 0
    }
  },
  mounted() {
    this.step += 1;
  },
  methods: {
    validated() {
      this.$emit('validated')
      this.step += 1;
    }
  }
});
</script>

<style lang="scss" scoped>

</style>
