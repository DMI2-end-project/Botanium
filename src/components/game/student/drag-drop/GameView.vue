<script lang="ts" setup>
import {onMounted, ref, defineEmits, defineProps, nextTick} from "vue";
import {gsap} from "gsap";
import {Draggable} from "gsap/Draggable";
import {Flip} from "gsap/Flip";
import {useGameStore} from "../../../../stores/gameStore";

gsap.registerPlugin(Draggable, Flip);

const gameStore = useGameStore();

const props = defineProps(['data']);
const emit = defineEmits(['validated']);

const teamData = ref<any>(null);

const draggable = ref<HTMLDivElement>();
const droppables = ref<HTMLDivElement[]>([]);
const currentAnswer = ref<any>(null);

console.log('data', props.data, gameStore.data);

onMounted(async () => {
  await nextTick();
  //const droppables = document.querySelectorAll<HTMLDivElement>('.droppable');
  const container = document.querySelector('#container');

  if (gameStore.teamId !== undefined) {
    teamData.value = gameStore.data.gameSequences[gameStore.currentSequence].teams[gameStore.teamId];
    console.log('teamData', teamData.value);

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
          droppables.value.forEach(droppable => {
            if (this.hitTest(droppable, "50%")) {
              miss = false;
              if (draggable.value) {
                Flip.fit(draggable.value, droppable, {
                  scale: true
                });
                droppable.classList.add('selected');
                currentAnswer.value = droppable.dataset.isValid
              }
            } else {
              droppable.classList.remove('selected');
            }
          });

          if (miss) {
            if (draggable.value && container) {
              Flip.fit(draggable.value, container);
            }
          }
        }
      });
    }
  }
});

const itemValidated = () => {
  if (currentAnswer.value) {
    setTimeout(() => {
      emit('validated');
    }, 500)
  }
}
</script>

<template>
  <div>
    <div
        class="w-full h-full flex-1 flex items-center bg-background grid grid-cols-12 gap-4 px-8 text-center gap-5">
      <div
          class="col-span-3 aspect-[3/5] flex justify-center items-center border border-dashed border-beige rounded-md p-7">
        <div id="container" class="relative w-full h-full aspect-[5/9]">
          <div ref="draggable" class="w-full h-full bg-beige rounded-md">
            <img src="/src/assets/game-data/images/00102/amfine.png"
                 class="object-contain object-center"/>
          </div>
        </div>
      </div>
      <div class="col-span-9 flex gap-9 rounded-md px-10 pt-9 pb-14 bg-beige-medium">
        <div v-if="teamData" v-for="(answer, index) in teamData.answers" :v-bind="index"
             class="w-full flex flex-col justify-center items-center gap-6">
          <div ref="droppables"
               class="droppable w-full aspect-[5/9] bg-beige rounded-md flex items-center justify-center"
               :data-is-valid="answer.isValid">
            {{ answer.label }}...
          </div>
          <h3 class="w-full bg-green text-beige rounded-md">
            {{ answer.molecule }}
          </h3>
        </div>
      </div>
    </div>
    <button @click="itemValidated">Valider</button>
  </div>
</template>

