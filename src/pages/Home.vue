<script setup lang="ts">
import {DatabaseManagerInstance} from "../common/DatabaseManager";
import {useMainStore} from "../stores/mainStore";
import {onBeforeMount} from "vue";
import ModalView from "../components/common/ModalView.vue";

/*
* TODO : Ecran d'accueil enfant
* -
*
* */

const pb = DatabaseManagerInstance.pb;
const store = useMainStore();

onBeforeMount(() => {
//localStorage.removeItem('teamId')
//localStorage.removeItem('teamName')
})
</script>

<template>
  <div>
    <h1>Ecran d'accueil enfant {{ pb.authStore.model?.firstname }}</h1>
    {{ store.role }}
  </div>
</template>