<script lang="ts">
// Path: src\layouts\TheDefaultLayout.vue
import { defineComponent } from "vue";
export default defineComponent({
    name: "DefaultLayout",
});
</script>

<template>
    <main>
        <slot></slot>
    </main>
</template>
