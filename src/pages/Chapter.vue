<script setup lang="ts">
/*
  TODO :
     - Loaders Student
     - Loader Teacher
*/

import {onBeforeMount, onBeforeUnmount} from "vue";
import {getSocket} from "../client";
import {useMainStore} from "../stores/mainStore";
import {useChapterStore} from "../stores/chapterStore";
import {AudioManagerInstance} from "../common/AudioManager";
import {AUDIO, ROLE} from "../common/Constants";

import chaptersData from "../assets/json/chapters-data.json";

import StudentChapter from "./../components/chapter/student/StudentChapter.vue";
import TeacherChapter from "./../components/chapter/teacher/TeacherChapter.vue";

const mainStore = useMainStore();
const chapterStore = useChapterStore();

interface ChaptersData {
  [key: string]: any;
}

const socket = getSocket();

const key = mainStore.getChapterId as string;
const data: ChaptersData = chaptersData;
chapterStore.data = data[key];

onBeforeMount(async () => {
  await socket.connect();
  await socket.emit('join', {
    role: mainStore.role,
    roomId: mainStore.roomId
  });
});

</script>

<template>
  <TeacherChapter v-if="mainStore.role === ROLE.TEACHER"/>
  <StudentChapter v-if="mainStore.role === ROLE.STUDENT"/>
</template>
