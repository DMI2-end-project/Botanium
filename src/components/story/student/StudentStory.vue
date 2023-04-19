<template>
  <div>
    <h1>Student Story</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { getSocket } from "../../../client";
import {EVENT} from "../../../common/Constants";

export default defineComponent({
  name: 'InGameComponent',
  components: {
  },
  props: {
  },
  data () {
    return {
      socket: getSocket(),
      step: 0
    }
  },
  mounted() {
    // this.step += 1;
    this.socket.on(EVENT.START_GAME, () => {
      this.step = 1
    })

    this.socket.on(EVENT.SEND_INSTRUCTION, async (arg) => {
    });
  },
  methods: {
    validated() {
      this.$emit('validated')
      this.step += 1;
    }
  }
});
</script>

<style lang="scss" scoped>

</style>
