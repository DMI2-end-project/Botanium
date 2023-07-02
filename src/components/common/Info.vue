<template>
  <div class="bg-green text-white rounded-full flex justify-center items-center gap-5 p-2 min-w-[40vw]">
    <RoundItem v-if="!audioPath" :color="COLOR.GREEN_MEDIUM" :size="SIZE.SM">
      <slot/>
    </RoundItem>
    <Audio v-if="audioPath" :audio-path="audioPath"/>
    <p class="flex-1 text-center m-2 mr-8">{{ text }}</p>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {COLOR, SIZE} from "../../common/Constants";
import RoundItem from "./RoundItem.vue";
import Audio from "../Audio.vue";

export default defineComponent({
  name: 'WaitingComponent',
  components: {
    Audio,
    RoundItem
  },
  props: {
    text: String,
    audioPath: String
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
