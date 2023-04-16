<template>
  <div class="template-content grid grid-cols-2 gap-4 w-full h-full">
    <ImageElement :pageId="pageContent.id" :slotNumber="0" />
    <EditElement :pageId="pageContent.id" :slotNumber="0" />
    <div class="grid grid-rows-2 grid-flow-col gap-4">
      <EditElement :pageId="pageContent.id" :slotNumber="1" />
      <StickerElement :pageId="pageContent.id" :slotNumber="0" class="w-2/3 mt-auto ml-auto" />
    </div>
    <ImageElement :pageId="pageContent.id" :slotNumber="1" />
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
  data: () => {
    return {
    }
  },
  mounted() {
    console.log(this.pageContent.id)
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
