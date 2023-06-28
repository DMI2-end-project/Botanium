<script setup lang="ts">
import {computed, defineAsyncComponent, defineProps} from 'vue';
import {useMainStore} from "../../stores/mainStore";

const props = defineProps({
  name: {
    type: String || Number,
    required: true,
  },
  source: {
    type: String,
    default: 'game',
    validator(value: string) {
      // The value must match one of these strings
      return ['game', 'stickers', 'templates'].includes(value);
    }
  }
});

const dynamicComponent = computed<any>(() => {
  switch (props.source) {
    case 'game':
      return defineAsyncComponent(() => import(`../../assets/game-data/icons/${useMainStore().getFullGameId}/${props.name}.svg`));
    case 'stickers':
      return defineAsyncComponent(() => import(`../../assets/log-book/stickers/${props.name}.svg`));
    case 'templates':
      return defineAsyncComponent(() => import(`../../assets/log-book/templates/${props.name}.svg`));
  }
});
</script>

<template>
  <component :is="dynamicComponent"/>
</template>
