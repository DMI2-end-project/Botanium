<script setup lang="ts">
import {DatabaseManagerInstance} from "../common/DatabaseManager";
import {useStore} from "../stores/main";

/*
* TODO : Ecran d'accueil enfant
* -
*
* */

const pb = DatabaseManagerInstance.pb;
console.log('pb', pb.authStore.model?.role);
const store = useStore();
</script>

<template>
  <div>
    <h1>Ecran d'accueil enfant {{ pb.authStore.model?.firstname }}</h1>
    {{ store.role }}
  </div>
</template>