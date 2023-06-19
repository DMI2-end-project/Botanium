<template>
  <div class="bg-green text-white rounded-full flex justify-center items-center gap-5 p-2 min-w-[40vw]">
    <RoundItem :color="COLOR.GREEN_MEDIUM" :size="SIZE.SM">
      <slot />
    </RoundItem>
    <p class="m-2 mr-8 flex-1 text-center">{{ text }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { COLOR, SIZE } from "../../common/Constants";
import RoundItem from "./RoundItem.vue";

export default defineComponent({
  name: 'WaitingComponent',
  components: {
    RoundItem
  },
  props: {
    text: String,
  },
  computed: {
    COLOR() {
      return COLOR
    },
    SIZE() {
      return SIZE
    },
  },
  mounted() {
  }
});
</script>

<style lang="scss" scoped>

</style>
