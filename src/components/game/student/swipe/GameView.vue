<template>
  <div >
    <p>Swipe</p>
    <button @click="$emit('validated');">Reussi</button>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {GameMasterManagerInstance} from "../../../../common/GameMasterManager";

// TODO : DYNAMIC SVG
export default defineComponent({
    name: "StudentGameView",
});
</script>
