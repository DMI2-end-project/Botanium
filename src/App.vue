<script lang="ts">
import {defineComponent} from "vue";
import {useStore} from "./stores/main";

export default defineComponent({
  name: 'App',
});
</script>

<template>
  <router-view/>
</template>
