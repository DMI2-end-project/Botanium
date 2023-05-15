<template>
  <div class="bg-green text-white rounded-full flex justify-center items-center gap-5 p-2 min-w-[40vw]">
    <RoundItem classProperty="bg-green-medium" size="sm">
      <slot />
    </RoundItem>
    <p class="m-2 mr-8 flex-1">{{ text }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import RoundItem from "./RoundItem.vue";

export default defineComponent({
  name: 'WaitingComponent',
  components: {
    RoundItem
  },
  props: {
    text: String,
  },
  mounted() {
  }
});
</script>

<style lang="scss" scoped>

</style>
