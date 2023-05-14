<script setup lang="ts">
import {useGameStore} from "../../stores/gameStore";
import {getSocket} from "../../client";
import {useMainStore} from "../../stores/mainStore";
import {BTN_COlOR, EVENT, ROLE} from "../../common/Constants";
import {useRouter} from "vue-router";

import Trophy from "../../assets/svg/ico-trophy.svg?component";
import Button from "../Button.vue";
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
  <div class="relative flex flex-col items-center text-beige text-center mt-20">
    <div class="absolute flex justify-center items-center -translate-y-1/2 aspect-square w-36 text-beige bg-secondary rounded-full font-bold p-3">
        <Trophy class="w-14 aspect-square"/>
    </div>
    <div class="w-full bg-green rounded-md flex flex-col gap-4 items-center py-24 px-28 mb-8">
      <h1>Incroyable !</h1>
      <p>{{ gameStore.data?.congratulation }}</p>
    </div>
    <Button v-show="mainStore.role === ROLE.TEACHER" @click="next" label="Suivant" :color="BTN_COlOR.PINK"/>
  </div>
</template>
