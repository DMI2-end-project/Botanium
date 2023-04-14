<template>
  <v-layout>
    <v-main>
      <div class="mb-8 flex">
        <div>Auth state : {{ pb.authStore.isValid }}, Socket state : {{ store.connected }},
          RoomID : {{ store.roomId }}, Role : {{ store.role }}</div>
        <button @click="disconnect" class="ml-auto block">Déconnexion</button>
      </div>
      <!--The <slot> element is a slot outlet that indicates where the "VIEW" content should be rendered.-->
      <slot></slot>
    </v-main>
  </v-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {useRouter} from "vue-router";
import { getSocket } from "../client";
import { useStore } from "../stores/main";
import {DatabaseManagerInstance} from "../common/DatabaseManager";


export default defineComponent({
  name: 'TheDevLayout',
  data() {
    return {
      store: useStore(),
      router: useRouter(),
      socket: getSocket(),
      pb: DatabaseManagerInstance.pb
    }
  },
  methods: {
    DatabaseManagerInstance() {
      return DatabaseManagerInstance
    },
    disconnect() {
      this.socket.disconnect();
      this.pb.authStore.clear();
      this.store.roomId = undefined;
      this.router.push('/');
    }
  }
});
</script>

<style lang="scss" scoped>

</style>
