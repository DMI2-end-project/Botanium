<template>
  <div>
    <Book />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Book from '../components/log-book/Book.vue'

export default defineComponent({
  name: 'LogBookComponent',
  components: {
    Book
  },
  data () {
    return {

    }
  },
});
</script>

<style lang="scss" scoped>

</style>
