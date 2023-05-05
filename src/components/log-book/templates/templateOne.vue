<template>
  <div class="template-content flex flex-col gap-4 w-full h-full">
    <div class="flex flex-1 h-1/2 gap-4">
      <ImageElement :pageId="pageContent.id" :slotNumber="0" :isPageLeft="pageContent.pageNumber % 2 === 1" @onModify="$emit('onModify', $event)" classProperty="w-1/2 flex-1" />
      <EditElement :pageId="pageContent.id" :slotNumber="0" @onModify="$emit('onModify', $event)" classProperty="w-1/2 flex-1" />
    </div>
    <div class="flex flex-1 h-1/2 gap-4">
      <div class="grid grid-rows-2 grid-flow-col gap-4 w-1/2 flex-1">
        <EditElement :pageId="pageContent.id" :slotNumber="1" @onModify="$emit('onModify', $event)" />
        <StickerElement :pageId="pageContent.id" :slotNumber="0" class="w-2/3 mt-auto mr-auto" :isPageLeft="pageContent.pageNumber % 2 === 1" @onModify="$emit('onModify', $event)" />
      </div>
      <ImageElement :pageId="pageContent.id" :slotNumber="1" :isPageLeft="pageContent.pageNumber % 2 === 1" @onModify="$emit('onModify', $event)" classProperty="w-1/2 flex-1" />
    </div>
  </div>
</template>

<script lang="ts">
import ImageElement from './../elements/ImageElement.vue';
import EditElement from './../elements/EditElement.vue';
import StickerElement from '../elements/StickerElement.vue';

export default {
  name: "TemplateOneComponent",
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
  mounted() {
  },
  methods: {
  }
};
</script>

<style scoped>
.template-content {
  grid-auto-rows: 1fr;
}
</style>
