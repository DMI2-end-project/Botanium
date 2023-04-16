<template>
  <div class="fixed z-30 w-screen h-screen bg-black/25 flex justify-center items-center">
    <div class="bg-white p-8">
      <div>
        <button v-for="template in numberTemplate" :v-bind="template" @click="templateId = template" class="m-5 p-0 overflow-hidden drop-shadow-lg">
          <img :src="'./templates/' + template + '.svg'">
        </button>
      </div>
      <button v-if="templateId !== -1" @click="validate">Valider</button>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "AddPageComponent",
  props: {
    page: {
      type: Number,
      default: 0
    }
  },
  emits: ['close'],
  data: () => {
    return {
      templateId: -1,
      numberTemplate: 3
    }
  },
  methods: {
    validate() {
      this.$emit('close', this.templateId)
    }
  }
};
</script>

<style scoped>
</style>
