<template>
    <v-layout>
        <v-main>
          <div class="mb-8">
            <Button @click="disconnect" class="ml-auto block">Déconnection</Button>
          </div>
          <!--The <slot> element is a slot outlet that indicates
                where the "VIEW" content should be rendered.-->
            <slot></slot>
        </v-main>
    </v-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TheDevLayout',
  mounted() {

  },
  methods: {
    disconnect() {
      console.log("disconnect")
    }
  }
});
</script>

<style lang="scss" scoped>

</style>
