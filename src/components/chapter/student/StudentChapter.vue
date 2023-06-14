<template>
  <div class="bg-gray-100 flex p-6 text-black">
    <h1>Student Chapter</h1>
    <CircleButton v-show="chapterStore.currentStep === CHAPTER_STEP.INTRODUCTION && !chapterStore.sheetUnlocked" @click="router.push('/scan')"
                  text="Scanner tes missions" :color="COLOR.YELLOW" :size="SIZE.SM" :colorReverse="true">
      <Sheet/>
    </CircleButton>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {useRouter} from "vue-router";
import {getSocket} from "../../../client";
import {useChapterStore} from "../../../stores/chapterStore";
import {CHAPTER_STEP, COLOR, SIZE} from "../../../common/Constants";
import RoundButton from "../../common/RoundButton.vue";

import Sheet from "../../../assets/svg/ico-book.svg?component";
import CircleButton from "../../common/CircleButton.vue";

export default defineComponent({
  name: 'InGame',
  computed: {
    SIZE() {
      return SIZE
    },
    CHAPTER_STEP() {
      return CHAPTER_STEP
    },
    COLOR() {
      return COLOR
    }
  },
  components: {CircleButton, RoundButton, Sheet},
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
