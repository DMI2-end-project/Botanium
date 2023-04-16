<template>
  <div class="template-content flex flex-col w-full h-full">
    <div class="flex h-2/5 relative pb-4">
      <ImageElement :pageId="pageContent.id" :slotNumber="0" class="w-4/5 mr-8" />
      <StickerElement :pageId="pageContent.id" :slotNumber="0" class="w-1/3 mt-2 absolute right-0" />
    </div>
    <div class="grid grid-cols-2 gap-4 h-3/5">
      <EditElement :pageId="pageContent.id" :slotNumber="0" class="w-1/2" />
      <EditElement :pageId="pageContent.id" :slotNumber="1" class="w-1/2" />
    </div>
  </div>
</template>

<script lang="ts">
import ImageElement from './../elements/ImageElement.vue';
import StickerElement from './../elements/StickerElement.vue';
import EditElement from './../elements/EditElement.vue';

export default {
  name: "TemplateThreeComponent",
  components: {
    ImageElement,
    EditElement,
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
