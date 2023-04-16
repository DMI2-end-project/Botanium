<template>
  <button class="edit-element w-full h-full bg-gray-100" :class="classProperty" @click="onModify = true">
    <p v-if="!text">edit</p>
    <p>{{ text }}</p>
  </button>
  <div v-if="onModify" class="fixed z-40 w-screen h-screen bg-black/25 flex justify-center items-center top-0 left-0">
    <div class="bg-white p-8">
      <button @click="onWrite = true">Ecrire</button>
      <button>Dessiner</button>
      <br>
      <input type="text" v-if="onWrite" autofocus v-model="text" class="mt-3">
      <button @click="saveData">Valider</button>
    </div>

  </div>
</template>

<script lang="ts">
import { DatabaseManagerInstance } from "./../../../common/DatabaseManager";

export default {
  name: "EditElementComponent",
  props: {
    pageId: {
      type: String,
      default: null
    },
    slotNumber: {
      type: Number,
      default: null
    },
    classProperty: {
      type: String,
      default: null
    },
  },
  data: () => {
    return {
      pb: DatabaseManagerInstance.pb,
      onModify: false,
      onWrite: false,
      onDraw: false,
      text: '',
      idRecord: null,
    }
  },
  mounted() {
    this.pb.collection('text').getFirstListItem('page="'+ this.pageId +'" && slot=' + this.slotNumber + '').then(result => {
      this.text = result.content
      this.idRecord = result.id
    }).catch(error => {
      console.error(error.message)
    })
  },
  methods: {
    async saveData() {
      const data = {
          "content": this.text,
          "slot": this.slotNumber,
          "page": this.pageId
      };

      if (!this.idRecord) {
        await this.pb.collection('text').create(data);
      } else {
        await this.pb.collection('text').update(this.idRecord, data);
      }
      this.onModify = false;
    }
  }
};
</script>

<style scoped>
</style>
