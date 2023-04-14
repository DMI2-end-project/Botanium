<script lang="ts">
import {defineComponent} from "vue";
import {useStore} from "./stores/main";
import {DatabaseManagerInstance} from "./common/DatabaseManager";
import {ROLE} from "./common/constants";
import {connectClient} from "./client";
import TheDevLayout from "./layouts/TheDevLayout.vue";
import TheAppLayout from "./layouts/TheAppLayout.vue";

export default defineComponent({
  name: 'App',
  components: {TheAppLayout, TheDevLayout},
  data() {
    return {
      roomId: '2023'
    }
  },
  mounted() {
    const store = useStore();
    store.roomId = this.roomId;

    if (DatabaseManagerInstance.pb.authStore.isValid && store.role !== ROLE.PARENT) {
      connectClient()
    }
  }
});
</script>

<template>
  <!-- <router-view/> -->
  <TheAppLayout>
    <router-view/>
  </TheAppLayout>
</template>
