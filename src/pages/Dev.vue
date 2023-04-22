<script setup lang="ts">
import {useMainStore} from "../stores/mainStore";
import {useGameStore} from "../stores/gameStore";
import StoryStudent from "../components/story/student/StudentStory.vue";
import StoryTeacher from "../components/story/teacher/TeacherStory.vue";
import Instruction from '../components/game/Instruction.vue';
import GameStudent from "../components/game/student/StudentGame.vue";
import GameTeacher from "../components/game/teacher/TeacherGame.vue";
import InGameTeacher from "../components/game/teacher/InGame.vue";
import InGameStudent from "../components/game/student/InGame.vue";
import gameData from "../assets/game-data/game-data.json";
import Congratulation from "../components/game/Congratulation.vue";
import Breadcrumb from "../components/Breadcrumb.vue";

const mainStore = useMainStore();
const gameStore = useGameStore();
gameStore.data = gameData["00101"];
gameStore.teamId = 0;
</script>

<template>
  <div class="w-full h-full bg-green-medium grid grid-cols-12 text-center gap-5">
    <!--
    <Breadcrumb class="col-span-12"/>
    <StoryTeacher class="col-span-12"/>
    <Instruction class="col-start-3 col-span-8"/>
    <InGameTeacher class="col-span-12"/>
    <Congratulation class="col-start-3 col-span-8"/>
    -->
    <Breadcrumb class="col-span-12"/>
    <StoryStudent class="col-span-12"/>
    <Instruction class="col-start-3 col-span-8"/>
    <InGameStudent class="col-span-12"/>
    <Congratulation class="col-start-3 col-span-8"/>
  </div>
</template>