<template>
  <div class="template-content flex flex-col content-center w-full h-full">
    <div class="flex items-center h-2/5 relative pb-4">
      <ImageElement :pageId="pageContent.id" :slotNumber="0" classProperty="w-4/5" />
      <StickerElement :pageId="pageContent.id" :slotNumber="0" class="w-1/3 absolute right-0" />
    </div>
    <div class="flex items-center h-3/5">
      <StickerElement :pageId="pageContent.id" :slotNumber="1" class="w-1/3" />
      <ImageElement :pageId="pageContent.id" :slotNumber="1" classProperty="w-2/3 ml-4" />
    </div>
  </div>
</template>

<script lang="ts">
import ImageElement from './../elements/ImageElement.vue';
import StickerElement from './../elements/StickerElement.vue';

export default {
  name: "TemplateTwoComponent",
  components: {
    ImageElement,
    StickerElement
  },
  props: {
    pageContent: {
      type: Object,
      default: null
    }
  },
  data: () => {
    return {
    }
  },
  mounted () {
  },
  methods: {
  }
};
</script>

<style scoped>
</style>
