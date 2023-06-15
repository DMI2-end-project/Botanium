<script setup lang="ts">
import {useMainStore} from "../stores/mainStore";
import {DatabaseManagerInstance} from "../common/DatabaseManager";
import {GameMasterManagerInstance} from "../common/GameMasterManager";

import Book from "../assets/svg/ico-book.svg?component"
import router from "../router";

const store = useMainStore();

const launchGame = (i: number) => {
  GameMasterManagerInstance.launchChapter(1, '')
  GameMasterManagerInstance.launchGame(i)
}

</script>
<template>
  <div class="w-full h-full grid grid-cols-12 gap-4 px-8">
    <div class="col-span-12 flex justify-between items-center">
      <div></div>
      <div class="bg-beige rounded-full px-10 py-6">
        Bonjour {{ DatabaseManagerInstance.pb.authStore.model?.firstname }}, que souhaitez-vous faire ?
      </div>
      <div></div>
    </div>
    <div class="col-span-8"></div>
    <div class="col-span-4 bg-beige/50 rounded-lg flex flex-col gap-4 p-4">
      <h3 class="bg-beige/50 rounded-lg px-4 py-2 mb-4">
        Je veux consulter et gérer :
      </h3>
      <router-link :to="{ name: 'LogBook'}" class="inline-block bg-beige text-green p-4 rounded-lg origin-left">
        <h3>Carnet de bord</h3>
      </router-link>
      <router-link :to="{ name: 'Chapters'}" class="inline-block bg-beige text-green p-4 rounded-lg origin-left">
        <h3>Consulter les chapitres </h3>
      </router-link>
      <router-link :to="{ name: 'PhotoTaking'}" class="inline-block bg-beige text-green p-4 rounded-lg origin-left">
        <h3>Prendre des photos </h3>
      </router-link>
      <div class=" bg-beige rounded-md flex flex-col gap-6 p-6">
        <button v-for="i in 4" :v-bind="i" class="inline-block bg-primary p-4 rounded-lg" @click="launchGame(i)">
          Exercice {{ i }}
        </button>
      </div>
    </div>
  </div>
</template>
<style scoped>

</style>
