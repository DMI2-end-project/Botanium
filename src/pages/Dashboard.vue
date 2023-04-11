<template>
  <div>
    <h1>Dashboard</h1>
    <router-link to="/game">Let's play !</router-link>
    <button v-show="pb.authStore.isValid" @click="disconnect">Se déconnecter</button>
  </div>
</template>

<script setup lang="ts">
import {computed, onBeforeMount} from "vue";
import {useRouter} from "vue-router";
import {DatabaseManagerInstance} from "../common/DatabaseManager";

const router = useRouter();
const pb = DatabaseManagerInstance.pb;

const isConnected = computed(() => pb.authStore.isValid);

onBeforeMount(() => {
})

const disconnect = () => {
  pb.authStore.clear();
  router.push('/')
}
</script>

<style scoped>

</style>