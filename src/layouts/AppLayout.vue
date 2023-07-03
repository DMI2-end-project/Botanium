<script lang="ts">
// path: src/layouts/TheAppLayout.vue
import {computed, defineComponent} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {useMainStore} from "../stores/mainStore";
import {GameMasterManagerInstance} from "../common/GameMasterManager";
import { ROLE, COLOR, SIZE } from "../common/Constants";
import RoundButton from "../components/common/RoundButton.vue";
import ModalView from "../components/common/ModalView.vue";
import Option from "../assets/svg/ico-option.svg?component";

export default defineComponent({
  name: 'AppLayout',
  components: {RoundButton, ModalView, Option},
  data() {
    return {
      router: useRouter(),
      mainStore: useMainStore(),
      GMInstance: GameMasterManagerInstance,
      isModalOpen: false,
    }
  },
  computed: {
    ROLE() {
      return ROLE
    },
    COLOR() {
      return COLOR
    },
    SIZE() {
      return SIZE
    },
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
    },
    next() {
      GameMasterManagerInstance.endGame()
    },
    closeModal() {
      setTimeout(() => {this.isModalOpen = false}, 600)
      this.mainStore.closeModal()
      this.mainStore.askForRedirection = false;
    },
    openModal() {
      this.isModalOpen = true;
      this.mainStore.openModal()
    }
  }
});
</script>

<template>
  <RoundButton v-if="router.currentRoute.name !== 'Chapter'" @click="openModal" :color="COLOR.YELLOW" :size="SIZE.SM" class="!fixed bottom-6 right-8 z-50">
    <Option />
  </RoundButton>
  <component :is="layout">
    <slot/>
  </component>
  <ModalView v-if="isModalOpen" @close="closeModal" :close="true" :click-outside="true">
    <h1>Paramètres</h1>
    <div class="flex justify-center items-center gap-6">
      <div class="top-6 right-8 flex items-center gap-4">
        <button v-if="mainStore.role === ROLE.TEACHER" @click="killRoom">Kill</button>
          <button v-if="mainStore.role === ROLE.TEACHER && router.currentRoute.name === 'Game'" class="top-[80px] right-[30px]" @click="next">
          Do
        </button>
      </div>
    </div>
  </ModalView>
</template>
