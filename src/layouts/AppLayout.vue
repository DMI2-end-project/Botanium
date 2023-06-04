<script lang="ts">
// path: src/layouts/TheAppLayout.vue
import {computed, defineComponent} from 'vue';
import {useRoute} from 'vue-router';
import {useMainStore} from "../stores/mainStore";
import {ROLE} from "../common/Constants";

export default defineComponent({
  name: 'AppLayout',
  data() {
    return {
      mainStore: useMainStore()
    }
  },
  computed: {
    ROLE() {
      return ROLE
    }
  },
  setup() {
    const route = useRoute();
    /**
     *  This is a computed property that will return the name
     *  of the current route
     */
    const layout = computed(() => {
      const layout = route?.meta?.layout;
      if (layout) {
        return `${layout}Layout`;
      }
      return 'div';
    });
    return {
      layout,
    };
  },
});
</script>

<template>
  <router-link class="fixed bg-green p-2 rounded-md z-50"
               :to="mainStore.role === ROLE.STUDENT ? '/accueil' : '/tableau-de-bord'">
    Home
  </router-link>
  <component :is="layout">
    <slot/>
  </component>
</template>
