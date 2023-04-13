<script lang="ts">
import {defineComponent} from "vue";
import {useStore} from "./stores/main";
import {DatabaseManagerInstance} from "./common/DatabaseManager";
import {ROLE} from "./constants";
import {connectClient} from "./client";

export default defineComponent({
  name: 'App',
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
  <TheAppLayout/>
</template>
