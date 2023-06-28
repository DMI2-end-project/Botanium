<script lang="ts">
// path: src/layouts/TheAppLayout.vue
import {computed, defineComponent} from 'vue';
import {useRoute} from 'vue-router';
import {useMainStore} from "../stores/mainStore";
import {GameMasterManagerInstance} from "../common/GameMasterManager";
import {ROLE} from "../common/Constants";

export default defineComponent({
  name: 'AppLayout',
  data() {
    return {
      mainStore: useMainStore(),
      GMInstance: GameMasterManagerInstance
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
  methods: {
    killRoom() {
      this.GMInstance?.killRoom();
    }
  }
});
</script>

<template>
  <div class="fixed top-6 right-8 flex items-center gap-4 z-50">
    <button v-if="mainStore.role === ROLE.TEACHER" @click="killRoom">Kill</button>
  </div>
  <component :is="layout">
    <slot/>
  </component>
</template>
