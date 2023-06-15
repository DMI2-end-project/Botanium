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

    <div class="flex flex-col">
      <router-link :to="{ name: 'PhotoTaking'}"
                       class="bg-primary w-fit p-4 m-4 rounded-md">
            Prendre des photos
          </router-link>
    <router-link :to="{ name: 'LogBook'}"
                       class="bg-primary w-fit p-4 m-4 rounded-md">
            Carnet de bord
          </router-link>
    </div>
</div>
</template>
