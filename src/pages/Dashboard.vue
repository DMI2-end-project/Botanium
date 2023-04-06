<template>
  <div>
    <h1>Dashboard</h1>
    <router-link to="/game">Let's play !</router-link>
    <button v-show="pb?.authStore.isValid" @click="disconnect">Se déconnecter</button>
  </div>
</template>

<script setup lang="ts">
import PocketBase from "pocketbase";
import {computed, inject, onBeforeMount, ref} from "vue";
import {useRouter} from "vue-router";

const router = useRouter();

const pb: PocketBase | undefined = inject('pb');
const isConnected = computed(() => pb?.authStore.isValid);

onBeforeMount(() => {
  if (pb) {
    console.log(pb.authStore.isValid);
    console.log(pb.authStore.token);
    console.log(pb.authStore.model?.id);
  }
})

const disconnect = () => {
  console.log('log out')
  if (pb) {
    pb.authStore.clear();
    router.push('/')
    console.log(pb.authStore.isValid, isConnected);
  }
}
</script>

<style scoped>

</style>