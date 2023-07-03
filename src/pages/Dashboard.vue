<script setup lang="ts">
import {useMainStore} from "../stores/mainStore";
import {DatabaseManagerInstance} from "../common/DatabaseManager";
import {GameMasterManagerInstance} from "../common/GameMasterManager";
import {COLOR, SIZE} from "../common/Constants";
import AnimatedFoliage from "../components/AnimatedFoliage.vue";
import RoundButton from "../components/common/RoundButton.vue";

import Chevron from "../assets/svg/ico-chevron.svg?component";
import Organization from "../assets/svg/ico-organization.svg?component";

const store = useMainStore();

const launchGame = (i: number) => {
  GameMasterManagerInstance.launchChapter(1, '')
  GameMasterManagerInstance.launchGame(i)
}

</script>
<template>
  <AnimatedFoliage :show="true" class="overflow-hidden z-0"/>
  <div class="relative w-full h-full grid grid-cols-12 items-start gap-4 px-8 pb-10 lg:pb-16 pt-4 lg:pt-6">
    <div class="w-full col-span-12 flex flex-col sm:flex-row justify-between items-center">
      <img class="w-20 sm:w-32" src="/images/logo-simple.png" alt="Logo Les Petites Pousses">
      <p class="bg-beige rounded-full font-bold px-10 py-6">
        Bonjour {{ DatabaseManagerInstance.pb.authStore.model?.firstname }}, que souhaitez-vous faire ?
      </p>
      <div class="w-20 sm:w-32"/>
    </div>
    <div class="col-span-8 bg-beige-medium rounded-lg grid grid-cols-2 auto-rows-min gap-4 p-4">
      <div class="col-span-2 bg-beige/60 flex justify-between items-center rounded-lg px-4 py-2 mb-4">
        <h3>
          Organiser ma semaine
        </h3>
        <RoundButton :color="COLOR.GREEN_MEDIUM_BEIGE" :size="SIZE.XS" :number="-1">
          <Organization/>
        </RoundButton>
      </div>
      <div class="bg-beige rounded-lg p-2">
        <img src="/home/week-monday.jpg"/>
      </div>
      <div class="bg-beige rounded-lg p-2">
        <img src="/home/week-tuesday.jpg"/>
      </div>
      <div class="bg-beige rounded-lg p-2">
        <img src="/home/week-thursday.jpg"/>
      </div>
      <div class="bg-beige rounded-lg p-2">
        <img src="/home/week-friday.jpg"/>
      </div>
    </div>
    <div class="col-span-4 bg-beige-medium rounded-lg flex flex-col gap-4 p-4">
      <h3 class="bg-beige/60 rounded-lg px-4 py-2 mb-4">
        Je veux consulter et gérer
      </h3>
      <router-link :to="{ name: 'LogBook'}"
                   class="flex justify-between items-center bg-beige text-green p-4 rounded-lg origin-left">
        <h3>Carnet de bord</h3>
        <RoundButton :color="COLOR.GREEN_MEDIUM_BEIGE" :size="SIZE.XS" :number="0">
          <Chevron class="rotate-180"/>
        </RoundButton>
      </router-link>
      <router-link :to="{ name: 'Chapters'}"
                   class="flex justify-between items-center bg-beige text-green p-4 rounded-lg origin-left">
        <h3>Consulter les chapitres </h3>
        <RoundButton :color="COLOR.GREEN_MEDIUM_BEIGE" :size="SIZE.XS" :number="1">
          <Chevron class="rotate-180"/>
        </RoundButton>
      </router-link>
      <div class="flex justify-between items-center bg-beige text-green p-4 rounded-lg origin-left">
        <h3>Le guide du jardin</h3>
        <RoundButton :color="COLOR.GREEN_MEDIUM_BEIGE" :size="SIZE.XS" :number="2">
          <Chevron class="rotate-180"/>
        </RoundButton>
      </div>
      <router-link :to="{ name: 'PhotoTaking'}"
                   class="flex justify-between items-center bg-beige text-green p-4 rounded-lg origin-left">
        <h3>Prendre des photos </h3>
        <RoundButton :color="COLOR.GREEN_MEDIUM_BEIGE" :size="SIZE.XS" :number="3">
          <Chevron class="rotate-180"/>
        </RoundButton>
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
