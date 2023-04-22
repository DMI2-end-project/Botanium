<script setup lang="ts">
import {useMainStore} from "../stores/mainStore";
import {DatabaseManagerInstance} from "../common/DatabaseManager";

//import Book from "../assets/svg/ico-book.svg"

const store = useMainStore();

</script>
<template>
  <div class="w-full h-full flex flex-col gap-6 text-left overflow-hidden">
    <h1>Bonjour {{ DatabaseManagerInstance.pb.authStore.model?.firstname }}, que souhaitez-vous faire ?</h1>
    <div class="grid grid-cols-12">
      <div class="col-start-10 col-span-3 flex flex-col gap-4">
        <router-link :to="{ name: 'LogBook'}" class="inline-block bg-beige p-4 rounded-md origin-left">
          <!--Book class="w-full h-full"/--> Carnet de bord
        </router-link>
        <div class=" bg-beige rounded-md flex flex-col gap-6 p-6">
          <span class="text-lg text-black">L'histoire </span>
          <router-link :to="{ path: '/histoire'}"
                       class="inline-block bg-primary p-4 rounded-md">
            Consulter les chapitres
          </router-link>
        </div>
      </div>
    </div>

    <!-- query: { id: store.getFullGameId }} -->
  </div>
</template>
<style scoped>

</style>