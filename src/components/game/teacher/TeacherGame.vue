<template>
  <div class="bg-gray-100">
    <Instruction v-if="step === 0" :isTeacher="true" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Instruction from "../Instruction.vue";

export default defineComponent({
  name: 'InGameComponent',
  components: {
    Instruction
  },
  data () {
    return {
      step: 0
    }
  },
  mounted() {
    // this.step += 1;
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
