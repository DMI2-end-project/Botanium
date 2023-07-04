<script setup lang="ts">
import {useRouter} from "vue-router";
import {defineAsyncComponent} from 'vue';

import RoundButton from "../components/common/RoundButton.vue";
import Particles from "../components/home/Particles.vue"
import Dandelions from "../components/home/Dandelions.vue"
import Capucine from "../components/home/Capucine.vue"

import { COLOR } from "../common/Constants"

import Photo from "./../assets/svg/ico-photo.svg?component";

const router = useRouter()

const menuData = [
  { icon: defineAsyncComponent(() => import(`./../assets/svg/ico-assignments.svg`)), name: "Missions", url: '' },
  { icon: defineAsyncComponent(() => import(`./../assets/svg/ico-book.svg`)), name: "Fiches", url: '' },
  { icon: defineAsyncComponent(() => import(`./../assets/svg/ico-chapters.svg`)), name: "Chapitres", url: '' },
  { icon: defineAsyncComponent(() => import(`./../assets/svg/ico-sheets.svg`)), name: "Carnet", url:'' },
]
</script>

<template>
  <div class="bg-home inset-0 bg-cover bg-center fixed overflow-hidden">
    <Capucine />
    <img src="/home/plant-4.png" class="organic-5 absolute w-auto h-4/5 object-contain -bottom-[30%] -right-[2%] -scale-x-100">
    <img src="/home/plant-2.png" class="organic-4 absolute w-auto h-2/3 object-contain -top-[35%] -right-[10%]">
    <img src="/home/plant-3.png" class="organic-3 absolute w-1/3 h-full object-contain -top-[30%] -right-[15%]">
    <img src="/home/sun.png" class="sun absolute w-auto h-full object-contain -top-[0%] -left-[0%]">

    <Particles />
    <Dandelions />


    <div class="-scale-x-100 absolute w-1/3 h-auto object-contain -bottom-[5%] -right-[2%]">
      <img src="/home/plant-1.png" class="organic-2 origin-bottom-right">
    </div>


    <div class="absolute bottom-0 left-0 right-0 mx-auto w-fit px-12 pt-4 pb-8 bg-beige-medium/80 border-4 border-beige border-b-0 rounded-t-[60px] flex justify-around min-w-[40%] items-center gap-4">
      <div v-for="(data, index) in menuData" :v-bind="data.name" class="flex flex-col items-center">
        <RoundButton :color="COLOR.BEIGE" @click="() => {router.push({name: data.url})}" :number="index">
          <component :is="data.icon"/>
        </RoundButton>
        <p class="bg-green text-beige min-w-full px-4 py-1 rounded-full text-sm text-center mt-3">{{ data.name }}</p>
      </div>
    </div>

    <img src="/home/plant-1.png" class="organic-1 absolute w-1/2 h-auto object-contain -bottom-[25%] -left-[20%] origin-bottom-left">

    <div class="logo-container absolute py-6 px-12 top-0 left-0 right-0 mx-auto w-fit">
      <img src="/images/logo.png" class="w-[300px] h-auto object-fit">
    </div>

    <div class="absolute top-0 right-0 m-8">
      <RoundButton :color="COLOR.YELLOW" @click="() => {router.push({name: 'PhotoTaking'})}">
        <Photo />
      </RoundButton>
    </div>
</div>
</template>

<style scoped>
.organic-1{
  animation: organic 18s ease infinite;
}

.organic-2{
  animation: organic 15s ease infinite 0.2s;
}

.organic-3{
  animation: organic 19s ease infinite 0.1s;
}

.organic-4{
  animation: organic 20s ease infinite 0.4s;
}

.organic-5{
  animation: organic 24s ease infinite 0.1s;
}
@keyframes organic{
  0%{ transform: translate(0, 0) rotate(0deg); }
  25%{ transform: translate(25px, 3px) rotate(1.3deg); }
  50%{ transform: translate(5px, -4px) rotate(-0.4deg); }
  75%{ transform: translate(15px, 6px) rotate(0.6deg); }
  100%{ transform: translate(0, 0) rotate(0deg); }
}

.sun{
  animation: sun 5s ease infinite;
}

@keyframes sun{
  0%{ opacity: 1; }
  50%{ opacity: 0.6; }
  100%{ opacity: 1; }
}

.logo-container {
  background: radial-gradient(50% 50% at 50% 50%, #E3F0A5 0%, rgba(227, 240, 165, 0) 100%);
}
</style>
