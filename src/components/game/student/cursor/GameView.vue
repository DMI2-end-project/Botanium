<template>
  <div >
    <p>Cursor</p>
    <button @click="$emit('validated');">Reussi</button>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {GameMasterManagerInstance} from "../../../../common/GameMasterManager";

export default defineComponent({
    name: "StudentGameView",
});
</script>
