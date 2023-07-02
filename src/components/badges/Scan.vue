<script setup lang="ts">
import {computed, onMounted, onUnmounted, ref, watch} from "vue";
import * as tmImage from '@teachablemachine/image';
import {useMainStore} from "../../stores/mainStore";
import {useChapterStore} from "../../stores/chapterStore";
import {taskScanned} from "../../client";

import Camera from "../Camera.vue";
import Info from "../common/Info.vue";

import Loading from "../../assets/svg/ico-loading.svg?component";

const modelURL = '/tm-models/model.json';
const metadataURL = '/tm-models/metadata.json';

const mainStore = useMainStore();
const chapterStore = useChapterStore();

const emits = defineEmits(['ready', 'scanned']);

const camera = ref();
const isReady = ref<boolean>(false);

let model: tmImage.CustomMobileNet;
const exp = ref<string>('');

const frameRequestID = ref();
const timeoutID = ref();

const load = async () => {
  model = await tmImage.load(modelURL, metadataURL);
}
const predict = async (videoRef: HTMLVideoElement) => {
  console.log('predict')
  // predict can take in an image, video or canvas html element
  if (model && videoRef && videoRef.videoWidth) {
    let prediction = await model.predict(videoRef);
    prediction.forEach((predict: any) => {

      if (predict.probability > .8 && predict.className !== 'none') {
        console.log('className', predict.className)
        if (exp.value !== predict.className) {
          exp.value = predict.className;

          clearTimeout(timeoutID.value);
          timeoutID.value = setTimeout(() => {
            stop();
            taskScanned();
            emits('scanned', predict.className);
          }, 3000);
        }
      } else if (predict.probability > .8 && predict.className === 'none') {
        exp.value = '';
      }
    })
  }
}
const start = () => {
  let fps = 2;
  let then = Date.now();
  let interval = 1000 / fps;
  let delta;
  let now;

  const update = async () => {
    frameRequestID.value = window.requestAnimationFrame(update);
    now = Date.now();
    delta = now - then;

    if (delta > interval) {
      then = now - (delta % interval);
      await predict(camera.value.videoRef);
    }
  }

  update();
}
const stop = () => {
  if (frameRequestID.value) {
    cancelAnimationFrame(frameRequestID.value);
  }
}

defineExpose({
  start
});

onMounted(() => {
  load();
});

onUnmounted(() => {
  stop();
});

</script>

<template>
  <div class="flex-1 grid grid-cols-12 w-full h-full max-h-screen overflow-hidden py-12">
    <div
        class="col-span-10 col-start-2 lg:col-span-8 lg:col-start-3 relative h-full flex flex-col overflow-hidden gap-4 lg:gap-10 justify-center h-full my-auto">
      <div class="relative">
        <div class="h-full aspect-video">
          <Camera ref="camera" @ready="() => emits('ready')" facing-mode="environment"/>
          <div
              class="absolute top-0 aspect-[6/8] h-full left-1/2 -translate-x-1/2 scale-90 border-8 border-dashed rounded-xl"
              :class="exp ? 'border-blue' : 'border-beige'"/>
        </div>
      </div>
      <Info class="mt-0 z-10" text="Placez les badges un par un dans la zone centrale">
        <Loading class="loading-animation w-8 aspect-square"/>
      </Info>
    </div>
  </div>
</template>