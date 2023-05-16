<script setup lang="ts">
import {useGameStore} from "../../stores/gameStore";
import {getSocket} from "../../client";
import {useMainStore} from "../../stores/mainStore";
import {COlOR, SIZE, EVENT, ROLE} from "../../common/Constants";
import { useRouter } from "vue-router";
import RoundButtonVue from "../common/RoundButton.vue";
import RoundItemVue from "../common/RoundItem.vue";

import Trophy from "./../../assets/svg/ico-trophy.svg?component";
// TODO : Add ico-arrow.svg
//import Arrow from "../../assets/svg/ico-arrow.svg?component";

const mainStore = useMainStore();
const gameStore = useGameStore();
const socket = getSocket();
const router = useRouter();

const next = async () => {
  mainStore.gameId += 1;
  await socket.emit(EVENT.BACK_STORY, {
    roomId: mainStore.roomId,
    gameId: mainStore.gameId
  });
  await router.push('/chapitre/' + mainStore.chapterId)
}
</script>

<template>
  <div class="relative flex flex-col items-center text-beige text-center my-20">
    <RoundItemVue :size="SIZE.LG" :color="COlOR.YELLOW" class="absolute translate-y-1/2">
      <Trophy class="w-14 aspect-square"/>
    </RoundItemVue>
    <div class="w-full bg-green rounded-md flex flex-col gap-4 items-center py-24 px-28">
      <h1>Incroyable !</h1>
      <p>{{ gameStore.data?.games[gameStore.currentPart].congratulation.text }}</p>
    </div>
    <RoundButtonVue v-if="mainStore.role === ROLE.TEACHER" @click="next" class="mt-8 text-lg font-bold">
      >
    </RoundButtonVue>
  </div>
</template>
