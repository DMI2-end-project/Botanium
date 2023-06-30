<script lang="ts" setup>
import {nextTick, onMounted, provide, ref, watch} from "vue";
import {gsap} from "gsap";
import {Draggable} from "gsap/Draggable";
import {Flip} from "gsap/Flip";

import {useMainStore} from "../../../../stores/mainStore";
import {useGameStore} from "../../../../stores/gameStore";
import {shuffle} from "../../../../common/Lib";
import {COLOR} from "../../../../common/Constants";
import RoundButton from "../../../common/RoundButton.vue";
import CardGame from "../../CardGame.vue";

import Check from "./../../../../assets/svg/ico-check.svg?component";
import CardSlot from "../../CardSlot.vue";
import DragDropGrid from "../../DragDropGrid.vue";
import SvgIcon from "../../../common/SvgIcon.vue";

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
    teamData.value.answers = shuffle(teamData.value.answers);

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
      class="w-full h-full flex-1 grid grid-cols-12 items-center gap-8 lg:gap-16 pt-4 px-8 container mx-auto">
    <div class="col-span-3 w-full">
      <div class="relative">
        <CardSlot class="relative aspect-[5/9] bg-purple" outline background shadow>
          <SvgIcon name="ico-carrot" class="w-2/3 grayscale brightness-50 opacity-10"/>
        </CardSlot>
        <div id="container" class="absolute top-0 left-0 w-full h-full">
          <div ref="draggable" class="relative w-full h-full">
            <CardGame mode="vertical"
                      :answer-state="currentIndex === -1 ? 'none' : teamData.answers[currentIndex].status"
                      class="h-full text-left">
              <template v-slot:recto>
                <img v-if="teamData" alt=""
                     :src="`/game/images/${mainStore.getFullGameId}/${teamData.image}`"
                     class="w-full h-full object-contain object-center mb-10"/>
                <div class="absolute left-4 bottom-2 flex flex-col gap-2">
                  <p><b>La carotte</b></p>
                  <p v-if="teamData" class="font-hand-written text-lg">{{ teamData.name }}</p>
                </div>
              </template>
            </CardGame>
          </div>
        </div>
      </div>
    </div>
    <DragDropGrid class="relative w-full col-span-9 pb-12">
      <div v-if="teamData" v-for="(answer, index) in teamData.answers" :v-bind="index"
           class="w-full flex flex-col justify-center items-center text-center gap-6 z-10 max-w-[25vh] mx-auto">
        <div
            class="relative w-full rounded-lg overflow-hidden p-2 aspect-[5/9] max-h-[40vh] bg-beige rounded-md flex items-center justify-center"
            :data-is-valid="answer.isValid">
          <CardSlot class="!absolute top-0 left-0 w-full h-full aspect-[5/9]" shadow :answer-state="answer.status">
            <span class="font-hand-written text-beige-dark text-2xl leading-none">{{ answer.label }}...</span>
          </CardSlot>
          <div ref="droppables" class="relative w-full h-full rounded-lg"/>
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
    </DragDropGrid>
  </div>
</template>
