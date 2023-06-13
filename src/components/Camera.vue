<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref} from "vue";

const props = defineProps({
  facingMode: {
    default: 'environment',
    validator(value: string) {
      // The value must match one of these strings
      return ['environment', 'user'].includes(value);
    }
  }
});
const emits = defineEmits(['ready']);

const videoRef = ref<HTMLVideoElement>();
defineExpose({videoRef});

const getStream = (currentVideo: HTMLVideoElement): MediaStream | null => {
  return (currentVideo && currentVideo.srcObject instanceof MediaStream) ? currentVideo.srcObject : null;
}

const handleSuccess = async (currentVideo: HTMLVideoElement, stream: MediaStream) => {
  if (currentVideo) {
    currentVideo.srcObject = stream;
    await currentVideo.play();
    emits('ready');
  }
}

const handleError = (info: any) => {
  console.log('handleError', info)
}

onMounted(() => {
  const currentVideo = videoRef.value;
  const constraints = {
    audio: false,
    video: {
      facingMode: props.facingMode
    }
  };

  //console.log('props.facingMode', props.facingMode);
  //console.log('window.navigator.mediaDevices', window.navigator, window.navigator.mediaDevices);

  if (currentVideo && window.navigator && window.navigator.mediaDevices) {
    window.navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => handleSuccess(currentVideo, stream))
      .catch(handleError);
  }
})

onBeforeUnmount(() => {
  const currentVideo = videoRef.value;

  if (currentVideo) {
    currentVideo.pause();

    const stream = getStream(currentVideo);
    if (stream) {
      const tracks = stream.getTracks();
      for (const track of tracks) {
        track.stop();
      }
    }

    if (currentVideo) {
      currentVideo.srcObject = null;
    }
  }
})

</script>

<template>
  <video ref="videoRef" class="absolute w-full h-full top-0 left-0 object-cover object-center bg-purple/20"
         autoplay muted playsinline/>
</template>