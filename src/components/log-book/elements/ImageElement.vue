<template>
  <button class="image-element w-full h-full bg-gray-100 p-0" @click="modify">
    <img v-if="image" :src="image" class="h-full w-full object-contain">
    <p v-if="!image">image</p>
  </button>
  <div v-if="onModify" class="fixed z-40 w-screen h-screen bg-black/25 flex justify-center items-center top-0 left-0">
    <div class="bg-white p-8">
      <div class="grid grid-cols-3 gap-4">
        <div v-for="image in imageList" :v-bind="image" class="w-48 h-48 flex justify-center items-center">
          <button @click="imageSelected = image" class="p-0 overflow-hidden">
            <img :src="getImageUrl(image)" class="object-contain w-full h-full pointer-events-none">
          </button>
        </div>
      </div>
      <button @click="saveData">Valider</button>
    </div>
  </div>
</template>

<script lang="ts">
import { DatabaseManagerInstance } from "./../../../common/DatabaseManager";

export default {
  name: "ImageElementComponent",
  props: {
    pageId: {
      type: String,
      default: null
    },
    slotNumber: {
      type: Number,
      default: null
    }
  },
  data: () => {
    return {
      pb: DatabaseManagerInstance.pb,
      image: '',
      idRecord: null,
      onModify: false,
      imageList: [],
      imageSelected: null,
    }
  },
  mounted() {
    this.pb.collection('photo').getFirstListItem('page="' + this.pageId + '" && slot=' + this.slotNumber + '').then(result => {
      this.idRecord = result.id
      this.image = this.getImageUrl(result);
    }).catch(error => {
      console.error(error.message)
    })
  },
  methods: {
    modify() {
      this.onModify = true
      this.pb.collection('photo').getFullList(200 /* batch size */, {
        sort: '-created',
        filter: 'page = ""',
      }).then(result => {
        this.imageList = result
      }).catch(error => {
        console.error(error.message)
      })
    },
    getImageUrl(data) {
      return this.$pocketBaseUrl + "api/files/" + data.collectionId + '/' + data.id + '/' + data.file
    },
    async saveData() {
      const data = {
        "page": this.pageId,
        "slot": this.slotNumber
      };

      const dataDelete = {
        "page": "",
        "slot": 0
      };

      console.log(this.imageSelected)

      await this.pb.collection('photo').update(this.imageSelected.id, data);

      if (this.idRecord) {
        await this.pb.collection('photo').update(this.idRecord, dataDelete);
      }

      this.idRecord = this.imageSelected.id
      this.image = this.getImageUrl(this.imageSelected)
      this.onModify = false;
    }
  }
};
</script>

<style scoped>
</style>
