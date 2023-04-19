<script lang="ts">
import {defineComponent} from "vue";
import {useMainStore} from "./stores/mainStore";
import {DatabaseManagerInstance} from "./common/DatabaseManager";
import {ROLE} from "./common/Constants";
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
    const store = useMainStore();
    store.roomId = this.roomId;
    store.roleId = DatabaseManagerInstance.pb.authStore.model?.role;

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
