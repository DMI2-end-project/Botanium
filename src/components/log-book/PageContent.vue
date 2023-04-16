<template>
  <div class="page-content">
    <Template1 v-if="content?.template === 1" :page-content="content" @onModify="$emit('onModify', $event)" />
    <Template2 v-if="content?.template === 2" :page-content="content" @onModify="$emit('onModify', $event)" />
    <Template3 v-if="content?.template === 3" :page-content="content" @onModify="$emit('onModify', $event)" />
  </div>
</template>

<script lang="ts">
import Template1 from "./templates/templateOne.vue"
import Template2 from "./templates/TemplateTwo.vue"
import Template3 from "./templates/TemplateThree.vue"

export default {
  name: "PageContentComponent",
  components: {
    Template1,
    Template2,
    Template3
  },
  props: {
    content: {
      type: Object,
      default: null
    }
  },
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
.page-content {
  width: 100%;
  height: 100%;
}
.page-content img {
  width: 100%;
}
</style>
