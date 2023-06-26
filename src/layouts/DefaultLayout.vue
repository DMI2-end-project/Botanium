<script lang="ts">
import {defineComponent} from "vue";
import {useRouter} from "vue-router";
import RoundButton from "../components/common/RoundButton.vue";
import {COLOR, ROLE} from "../common/Constants";
import {useMainStore} from "../stores/mainStore";
import Home from "../assets/svg/ico-home.svg?component";

export default defineComponent({
  name: "DefaultLayout",
  components: {Home, RoundButton},
  data() {
    return {
      router: useRouter(),
      mainStore: useMainStore()
    }
  },
  computed: {
    ROLE() {
      return ROLE
    },
    COLOR() {
      return COLOR
    },
    show() {
      return this.router.currentRoute.name !== 'Dashboard' && 'Home';
    }
  },
});
</script>

<template>
  <div class="bg-beige-medium min-h-screen flex flex-col">
    <header class="w-full flex items-center z-20">
      <RoundButton v-if="show" :color="COLOR.YELLOW" class="!absolute top-6 left-8"
                   @click="router.push({name: mainStore.role === ROLE.STUDENT ? 'Home' : 'Dashboard'})">
        <Home/>
      </RoundButton>
      <slot name="header"></slot>
    </header>
    <main class="w-full h-full">
      <slot></slot>
    </main>
  </div>
</template>
