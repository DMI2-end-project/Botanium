<template>
    <v-layout>
        <v-main>
          <div class="mb-8 flex">
            <div>Socket state : {{ store.connected }}, RoomID : {{ store.roomId }}, Role : {{ store.role }}</div>
            <Button @click="disconnect" class="ml-auto block">Déconnection</Button>
          </div>
          <!--The <slot> element is a slot outlet that indicates
                where the "VIEW" content should be rendered.-->
            <slot></slot>
        </v-main>
    </v-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { getSocket } from "../client";
import { useStore } from "../stores/main";


export default defineComponent({
  name: 'TheDevLayout',
  data() {
    return {
      store: useStore()
    }
  },
  methods: {
    disconnect() {
      const socket = getSocket();
      socket.disconnect();
    }
  }
});
</script>

<style lang="scss" scoped>

</style>
