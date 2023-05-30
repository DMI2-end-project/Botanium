<script lang="ts" setup>
import {GameMasterManagerInstance} from "../../../../common/GameMasterManager";
</script>

<template>
  <div>
    <p>Drag drop</p>
    <button @click="$emit('validated');">Reussi</button>
  </div>
</template>

