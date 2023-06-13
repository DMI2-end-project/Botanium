<template>
  <div class="bg-gray-100 flex p-6 text-black">
    <h1>Student Chapter</h1>
    <RoundButton v-if="chapterStore.currentStep === CHAPTER_STEP.INTRODUCTION" :color="COLOR.YELLOW" @click="router.push('/scan')">
      <Sheet/>
    </RoundButton>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {useRouter} from "vue-router";
import {getSocket} from "../../../client";
import {useChapterStore} from "../../../stores/chapterStore";
import {CHAPTER_STEP, COLOR} from "../../../common/Constants";
import RoundButton from "../../common/RoundButton.vue";

import Sheet from "../../../assets/svg/ico-book.svg?component";

export default defineComponent({
  name: 'InGame',
  computed: {
    CHAPTER_STEP() {
      return CHAPTER_STEP
    },
    COLOR() {
      return COLOR
    }
  },
  components: {RoundButton, Sheet},
  emits: ['validated'],
  data() {
    return {
      socket: getSocket(),
      router: useRouter(),
      chapterStore: useChapterStore()
    }
  },
  mounted() {
  },
  methods: {
    validated() {
      this.$emit('validated');
    }
  }
});
</script>

<style lang="scss" scoped>

</style>
