<script lang="ts" setup>
import {nextTick, onMounted, ref} from "vue";
import {gsap} from "gsap";
import {Draggable} from "gsap/Draggable";
import {Flip} from "gsap/Flip";

import {useMainStore} from "../../../../stores/mainStore";
import {useGameStore} from "../../../../stores/gameStore";
import {COLOR} from "../../../../common/Constants";
import RoundButton from "../../../common/RoundButton.vue";
import CardGame from "../../CardGame.vue";

import Check from "./../../../../assets/svg/ico-check.svg?component";

gsap.registerPlugin(Draggable, Flip);

const mainStore = useMainStore();
const gameStore = useGameStore();

const emit = defineEmits(['validated']);

const teamData = ref<any>(null);

const draggable = ref<HTMLDivElement>();
const droppables = ref<HTMLDivElement[]>([]);
const currentAnswer = ref<any | undefined>(undefined);
const currentIndex = ref<number>(-1);

const playingTeams = () => {
  return gameStore.teams.filter((team: any) => team.isPlaying);
}

onMounted(async () => {
  await nextTick();
  //const droppables = document.querySelectorAll<HTMLDivElement>('.droppable');
  const container = document.querySelector('#container');

  if (gameStore.teamId !== undefined) {
    teamData.value = gameStore.data.gameSequences[gameStore.currentSequence].teams[gameStore.teamId];

    if (draggable.value) {
      Draggable.create(draggable.value, {
        type: "x,y",
        edgeResistance: 0.65,
        inertia: true,
        onDrag: function (e) {
          droppables.value.forEach(droppable => {
            if (this.hitTest(droppable, "50%")) {
              droppable.classList.add('bg-green-light');
            } else {
              droppable.classList.remove('bg-green-light');
            }
          })
        },
        onDragEnd: function (e) {
          let miss = true;
          droppables.value.forEach((droppable, index) => {
            if (this.hitTest(droppable, "50%")) {
              miss = false;
              if (draggable.value) {
                Flip.fit(draggable.value, droppable, {
                  scale: true
                });
                droppable.classList.add('selected');
                currentIndex.value = index;
                //currentAnswer.value = droppable.dataset.isValid ? JSON.parse(droppable.dataset.isValid) : null;
              }
            } else {
              droppable.classList.remove('selected');
              teamData.value.answers[index].status = "none";
            }
          });

          if (miss) {
            if (draggable.value && container) {
              Flip.fit(draggable.value, container);
              currentAnswer.value = undefined;
            }
          }
        }
      });
    }
  }
});

const itemValidated = () => {
  if (currentIndex.value !== -1) {
    teamData.value.answers[currentIndex.value].status = teamData.value.answers[currentIndex.value].isValid ? 'valid' : 'error';
    if (teamData.value.answers[currentIndex.value].status === 'valid') {
      setTimeout(() => {
        emit('validated');
      }, 500);
    }
  }

  /*
  if (currentAnswer.value === true) {
    setTimeout(() => {
      emit('validated');
    }, 500)
  }
   */
}
</script>

<template>
  <div
      class="w-full h-full flex-1 grid grid-cols-12 items-center gap-5 text-center">
    <div
        class="col-span-3 flex justify-center items-center border border-dashed border-beige rounded-md p-2">
      <div id="container" class="relative w-full h-full aspect-[5/9]">
        <div ref="draggable" class="relative w-full h-full">
          <CardGame v-if="teamData" mode="vertical"
                    :answer-state="currentIndex === -1 ? 'none' : teamData.answers[currentIndex].status"
                    class="h-full">
            <template v-slot:recto>
              <img v-if="teamData" alt=""
                   :src="`/game/images/${mainStore.getFullGameId}/${teamData.image}`"
                   class="object-contain object-center"/>
            </template>
          </CardGame>
        </div>
        <!--div ref="draggable" class="w-full h-full bg-beige rounded-md">
          <img v-if="teamData"
               :src="`/game/images/${mainStore.getFullGameId}/${teamData.background}`"
               class="object-contain object-center"/>
        </div-->
      </div>
    </div>
    <div class="relative col-span-9 grid grid-cols-3 gap-9 rounded-md p-10 bg-beige-medium"
         :class="`grid-cols-${playingTeams.length}`">
      <div v-if="teamData" v-for="(answer, index) in teamData.answers" :v-bind="index"
           class="w-full flex flex-col justify-center items-center gap-6 z-10">
        <div ref="droppables"
             class="droppable w-full aspect-[5/9] bg-beige rounded-md flex items-center justify-center font-hand-written text-beige-dark text-2xl"
             :data-is-valid="answer.isValid">
          {{ answer.label }}...
        </div>
        <h3 class="w-full bg-green text-beige rounded-md">
          {{ answer.molecule }}
        </h3>
      </div>
      <div class="w-full flex justify-center absolute -bottom-20 left-0 right-0 mx-auto">
        <Transition name="scaleButtonBg">
          <RoundButton @click="itemValidated" :color-bg="COLOR.BEIGE_MEDIUM" :color="COLOR.GREEN_MEDIUM_BEIGE"
                       v-show="currentIndex !== -1">
            <Check/>
          </RoundButton>
        </Transition>
      </div>
    </div>
  </div>
</template>
