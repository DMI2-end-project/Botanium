<script setup lang="ts">
import {useGameStore} from "../../stores/gameStore";
import Trophy from "../../assets/svg/ico-trophy.svg";
import {getSocket} from "../../client";
import {useMainStore} from "../../stores/mainStore";
import {EVENT, ROLE} from "../../common/Constants";
import {useRouter} from "vue-router";

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
    <div class="absolute -translate-y-1/2 aspect-square w-36 text-beige bg-secondary rounded-full font-bold p-3">
      <span
          class="block w-full h-full flex justify-center items-center rounded-full border border-beige bg-secondary p-2">
        <!--Trophy class="w-14 aspect-square"/-->
      </span>
    </div>
    <div class="w-full bg-green rounded-md flex flex-col gap-4 items-center py-24 px-28">
      <h1>Incroyable !</h1>
      <p>{{ gameStore.data?.congratulation }}</p>
      <button v-show="mainStore.role === ROLE.TEACHER" class="cmx-auto my-5" @click="next">
        Continuer
      </button>
    </div>
  </div>
</template>
