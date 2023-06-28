<template>
  <div class="fixed z-30 w-screen h-screen bg-green/75 flex flex-col justify-center items-center">
    <div class="bg-beige-medium py-8 px-12 w-3/4 mt-20 rounded-lg">
      <div class="flex justify-around gap-6 sm:gap-12 lg:gap-16">
        <button v-for="template in numberTemplate" :v-bind="template" @click="templateId = template" class="my-4 flex-1 border-0 p-0 overflow-hidden drop-shadow-lg outline outline-8 transition-all duration-400" :class="templateId === template ? 'outline-yellow' : 'outline-transparent'">
          <!--img alt="" :src="'/log-book/templates/' + template + '.svg'" class="w-full"-->
          <SvgIcon source="templates" :name="template"/>
        </button>
      </div>
    </div>
    <RoundButton :is-active="templateId !== -1" :color="COLOR.GREEN_MEDIUM_BEIGE" @click="validate" class="mx-auto mt-6 block"><Check /></RoundButton>
  </div>
</template>

<script lang="ts">
import RoundButton from './../common/RoundButton.vue'
import { COLOR } from "./../../common/Constants";
import Check from "./../../assets/svg/ico-check.svg?component";
import { useMainStore } from '../../stores/mainStore';
import { useLogBookStore } from '../../stores/logBookStore';
import SvgIcon from "../common/SvgIcon.vue";

export default {
  name: "AddPageComponent",
  components: {
    SvgIcon,
    RoundButton, Check
  },
  props: {
    page: {
      type: Number,
      default: 0
    }
  },
  emits: ['close'],
  computed: {
    COLOR() {
      return COLOR
    }
  },
  watch: {
    'logBookStore.closeElements': {
      handler() {
        this.logBookStore.closeElements = false
        this.$emit('close', -1)
      },
      deep: true
    }
  },
  data: () => {
    return {
      mainStore: useMainStore(),
      logBookStore: useLogBookStore(),
      templateId: -1,
      numberTemplate: 3
    }
  },
  mounted() {
    this.logBookStore.isClosable = true
  },
  methods: {
    validate() {
      this.$emit('close', this.templateId)
    }
  },
  unmounted() {
    this.logBookStore.isClosable = false
  }
};
</script>

<style scoped>
</style>
