<script setup lang="ts">
import {ref} from "vue";
import {onClickOutside} from '@vueuse/core'
import {useMainStore} from "../../stores/mainStore";

const mainStore = useMainStore();

const container = ref<HTMLDivElement>();
onClickOutside(container, () => mainStore.isModalOpen = false);
</script>

<template>
  <Teleport to="#modal">
    <div v-if="mainStore.isModalOpen"
         class="absolute top-0 left-0 w-full h-full bg-green bg-opacity-80 flex justify-center items-center z-50">
      <div class="container mx-auto bg-beige flex flex-col gap-6 rounded-md p-6" ref="container">
        <slot/>
      </div>
    </div>
  </Teleport>
</template>