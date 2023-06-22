<script setup lang="ts">
import {ref} from "vue";
import {onClickOutside} from '@vueuse/core'
import {useMainStore} from "../../stores/mainStore";
import {COLOR, SIZE} from "../../common/Constants";
import RoundButton from "../../components/common/RoundButton.vue";

import Cross from "../../assets/svg/ico-cross.svg?component";

const mainStore = useMainStore();
const props = defineProps({
  padding: {
    type: Boolean,
    required: false,
    default: true
  },
  close: Boolean,
  clickOutside: Boolean
});

const emits = defineEmits(['close']);

const container = ref<HTMLDivElement>();

if (props.clickOutside) {
  onClickOutside(container, () => emits('close'));
}

</script>

<template>
  <Teleport to="#modal">
    <div v-if="mainStore.isModalOpen"
         class="fixed top-0 left-0 w-screen h-screen bg-green bg-opacity-80 flex justify-center items-center z-50">
      <div v-if="props.close" class="absolute right-2 top-2">
        <RoundButton @click="() => emits('close')" :color="COLOR.RED" :size="SIZE.SM">
          <Cross/>
        </RoundButton>
      </div>
      <div
          class="aspect-[5/3] container max-w-[600px] mx-auto bg-beige flex flex-col items-center text-center gap-6 rounded-md px-14"
          :class="padding ? ' justify-center py-11' : ''"
          ref="container">
        <slot/>
      </div>
    </div>
  </Teleport>
</template>