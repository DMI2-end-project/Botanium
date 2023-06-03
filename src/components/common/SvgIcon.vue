<script setup lang="ts">
import {computed, defineAsyncComponent, defineProps} from 'vue';
import {useMainStore} from "../../stores/mainStore";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
});

const dynamicComponent = computed<any>(() => {
  return defineAsyncComponent(() => import(`../../assets/game-data/icons/${useMainStore().getFullGameId}/${props.name}`));
});
</script>

<template>
  <component :is="dynamicComponent"/>
</template>
