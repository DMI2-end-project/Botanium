<template>
  <div class="template-content flex flex-col w-full h-full">
    <div class="flex h-2/5 relative pb-4">
      <ImageElement :pageId="pageContent.id" :slotNumber="0" classProperty="w-4/5" :isPageLeft="pageContent.pageNumber % 2 === 1" @onModify="$emit('onModify', $event)" />
      <StickerElement :pageId="pageContent.id" :slotNumber="0" class="w-1/3 mt-2 absolute right-0 -bottom-6" :isPageLeft="pageContent.pageNumber % 2 === 1" @onModify="$emit('onModify', $event)" />
    </div>
    <div class="grid grid-cols-2 gap-4 h-3/5">
      <div class="w-full relative">
        <EditElement :pageId="pageContent.id" :slotNumber="0" classProperty="h-5/6" @onModify="$emit('onModify', $event)" />
        <StickerElement :pageId="pageContent.id" :slotNumber="0" class="w-1/2 absolute left-4 bottom-0" :isPageLeft="pageContent.pageNumber % 2 === 1" @onModify="$emit('onModify', $event)" />
      </div>
      <EditElement :pageId="pageContent.id" :slotNumber="1" classProperty="h-5/6 mt-auto" @onModify="$emit('onModify', $event)" />
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
  emits: ['onModify'],
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
