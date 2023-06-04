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
  <div class="fixed flex items-center gap-4 z-50">
    <router-link class=" bg-green p-2 rounded-md"
                 :to="mainStore.role === ROLE.STUDENT ? '/accueil' : '/tableau-de-bord'">
      Home
    </router-link>
    <button v-if="mainStore.role === ROLE.TEACHER" @click="killRoom">Bye bye room</button>
  </div>
  <component :is="layout">
    <slot/>
  </component>
</template>
