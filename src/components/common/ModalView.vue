<script setup lang="ts">
import {defineProps, ref} from "vue";
import {onClickOutside} from '@vueuse/core'
import {useMainStore} from "../../stores/mainStore";
import {COLOR, SIZE} from "../../common/Constants";
import RoundButton from "../../components/common/RoundButton.vue";

import Cross from "../../assets/svg/ico-cross.svg?component";

const mainStore = useMainStore();
const props = defineProps(['close']);

const container = ref<HTMLDivElement>();
const closeModal = () => mainStore.isModalOpen = false;

onClickOutside(container, closeModal);
</script>

<template>
  <Teleport to="#modal">
    <div v-if="mainStore.isModalOpen"
         class="fixed top-0 left-0 w-screen h-screen bg-green bg-opacity-80 flex justify-center items-center z-50">
      <div v-if="props.close" class="absolute right-2 top-2">
        <RoundButton @click="closeModal" :color="COLOR.RED" :size="SIZE.SM">
          <Cross/>
        </RoundButton>
      </div>
      <div
          class="aspect-[5/3] container max-w-[600px] mx-auto bg-beige flex flex-col justify-center items-center text-center gap-6 rounded-md py-11 px-14"
          ref="container">
        <slot/>
      </div>
    </div>
  </Teleport>
</template>