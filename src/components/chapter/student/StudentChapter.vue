<template>
  <div class="bg-gray-100 flex p-6 text-black">
    <h1>Student Chapter</h1>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {getSocket} from "../../../client";
import {EVENT} from "../../../common/Constants";

export default defineComponent({
  name: 'InGame',
  data() {
    return {
      socket: getSocket(),
    }
  },
  mounted() {
  },
  methods: {
    validated() {
      this.$emit('validated');
    }
  }
});
</script>

<style lang="scss" scoped>

</style>
