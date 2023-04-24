<script setup lang="ts">
import {useMainStore} from "../stores/mainStore";
import {useGameStore} from "../stores/gameStore";
import StoryStudent from "../components/story/student/StudentStory.vue";
import Instruction from '../components/game/Instruction.vue';
import StudentGame from "../components/game/student/StudentGame.vue";
import Breadcrumb from "../components/Breadcrumb.vue";
import Congratulation from "../components/game/Congratulation.vue";
import Waiting from "../components/game/student/Waiting.vue";
import gameData from "../assets/game-data/game-data.json";
import {STEP} from "../common/Constants";

const mainStore = useMainStore();
const gameStore = useGameStore();
gameStore.data = gameData["00101"];
gameStore.teamId = 0;
gameStore.currentStep = STEP.WAIT;

</script>

<template>
  <div class="w-full h-full bg-green-medium grid grid-cols-12 text-center gap-5">
    <!--
    <Breadcrumb class="col-span-12"/>
    <StoryTeacher class="col-span-12"/>
    <Instruction class="col-start-3 col-span-8"/>
    <TeacherGame class="col-span-12"/>
    <Congratulation class="col-start-3 col-span-8"/>
    -->
    <Breadcrumb class="col-span-12"/>
    <StoryStudent class="col-span-12"/>
    <Instruction class="col-start-3 col-span-8"/>
    <StudentGame class="col-span-12"/>
    <Waiting class="col-start-3 col-span-8"/>
    <Congratulation class="col-start-3 col-span-8"/>
  </div>
</template>