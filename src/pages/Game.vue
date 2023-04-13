<script setup lang="ts">
import {useStore} from "../stores/main";

const store = useStore();

</script>

<template>
  <h1>Jeu</h1>
  <div>Socket state : {{ store.connected }}, RoomID : {{ store.roomId }}, Role : {{ store.role }}</div>
</template>
