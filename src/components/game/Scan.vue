<script setup lang="ts">
import {onMounted, onUnmounted, ref, watch} from "vue";
import * as tmImage from '@teachablemachine/image';

import Camera from "../Camera.vue";

const modelURL = '/tm-models/model.json';
const metadataURL = '/tm-models/metadata.json';

const camera = ref();
const isReady = ref<boolean>(false);

let model: tmImage.CustomMobileNet;
const exp = ref<string>('');

const frameRequestID = ref();
const timeoutID = ref();

const load = async () => {
  model = await tmImage.load(modelURL, metadataURL);
}
const ready = () => {
  isReady.value = true;
}

const predict = async (videoRef: HTMLVideoElement) => {
  let prediction = await model.predict(videoRef);
  // predict can take in an image, video or canvas html element
  if (model && videoRef && videoRef.videoWidth) {
    let prediction = await model.predict(videoRef);
    prediction.forEach((predict: any) => {
      if (predict.probability > .8 && predict.className !== 'none') {
        console.log('predict', predict.className)
        clearTimeout(timeoutID.value);
        exp.value = predict.className;
      } else if (!(predict.probability > .8 && predict.className === 'none')) {
        //setExp('');
      }
    })
  }
}

watch([isReady], ([newIsRead]) => {
  if (newIsRead) {
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

    update()
  }
})

onMounted(() => {
  load();
});

onUnmounted(() => {
  if (frameRequestID.value) {
    cancelAnimationFrame(frameRequestID.value);
  }
})

</script>

<template>
  <Camera ref="camera" @ready="ready" facing-mode="environment"/>
  <div :key="exp" class="relative z-10 bg-white text-xl mt-auto p-2">Tâche détectée : {{ exp }}</div>
</template>
