<template>
  <div class="fixed z-30 w-screen h-screen bg-black/25 flex justify-center items-center">
    <div class="bg-white p-8">
      <div>
        <button v-for="template in templates" :v-bind="template" @click="templateId = template" class="m-5 h-48" :class="templateId === template ? 'bg-gray-200' : ''">
          <p>template {{ template }}</p>
        </button>
      </div>
      <button @click="validate">Valider</button>
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
  data: () => {
    return {
      templateId: undefined,
      templates: [
        1, 2, 3
      ]
    }
  },
  mounted () {
  },
  methods: {
    validate() {
      if (this.templateId !== undefined) {
        this.$emit('close', this.templateId)
      }
    }
  }
};
</script>

<style scoped>
</style>
