<template>
  <button class="edit-element w-full h-full p-0" :class="classProperty + ' ' + (text || drawUrl ? 'bg-transparent' : 'bg-gray-100')" @click="onModify = true">
    <p v-if="!text && !drawUrl">edit</p>
    <div v-if="text" class="flex flex-col justify-between h-full bg-gray-200 p-4 drop-shadow-lg">
      <p class="text-xs text-left">{{ text }}</p>
      <p class="text-right mt-4">{{ signature }}</p>
    </div>
    <div v-if="drawUrl" class="flex flex-col justify-between h-full">
      <img :src="drawUrl" class="w-full h-full object-contain my-auto">
      <p class="text-right mt-4">{{ signature }}</p>
    </div>
  </button>
  <div v-if="onModify" class="fixed z-40 w-screen h-screen bg-black/25 flex justify-center items-center top-0 left-0">
    <div v-if="!onSignature" class="bg-white h-5/6 w-full p-8 m-12">
      <div v-if="!onWrite && !onDraw" class="h-full w-full grid grid-cols-2 gap-8">
        <button @click="onWrite = true">Ecrire</button>
        <button @click="onDraw = true">Dessiner</button>
      </div>
      <div v-if="onWrite" class="w-full h-full p-12 flex flex-col items-end">
        <textarea v-model="text" autofocus class="w-full h-full text-xl p-4">
        </textarea>
        <button @click="onSignature = true" class="mt-10">Valider</button>
      </div>
      <div v-if="onDraw" class="w-full h-full p-12 flex flex-col items-end">
        <Draw @save="saveDraw" />
      </div>
    </div>
    <div v-if="onSignature" class="bg-white p-8 flex flex-col items-center">
      <p>Note le ou les prénoms des élèves qui ont vécu  ce souvenir au jardin :</p>
      <input type="text" v-model="signature" class="mt-5">
      <button v-if="signature != ''" @click="saveData" class="mt-5">Valider</button>
    </div>
  </div>
</template>

<script lang="ts">
import { DatabaseManagerInstance } from "./../../../common/DatabaseManager";
import Draw from "./../Draw.vue"

export default {
  name: "EditElementComponent",
  components: {
    Draw
  },
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
      onSignature: false,
      text: '',
      signature: '',
      draw: '',
      drawUrl: '',
      idRecordText: null,
      idRecordDraw: null,
    }
  },
  watch: {
    onModify(value) {
      this.$emit('onModify', value)
    }
  },
  mounted() {
    this.pb.collection('text').getFirstListItem('page="'+ this.pageId +'" && slot=' + this.slotNumber + '').then(result => {
      this.text = result.content
      this.signature = result.signature
      this.idRecordText = result.id
    }).catch(error => {
      console.error(error.message)
    })
    this.pb.collection('drawing').getFirstListItem('page="'+ this.pageId +'" && slot=' + this.slotNumber + '').then(result => {
      this.drawUrl = this.getImageUrl(result)
      this.signature = result.signature
      this.idRecordDraw = result.id
    }).catch(error => {
      console.error(error.message)
    })
  },
  methods: {
    async saveData() {
      if (this.onWrite) {
        const data = {
          "content": this.text,
          "slot": this.slotNumber,
          "page": this.pageId,
          "signature": this.signature
        };

        if (!this.idRecordText) {
          const newText = await this.pb.collection('text').create(data);
          this.idRecordText = newText.id
        } else {
          await this.pb.collection('text').update(this.idRecordText, data);
        }
        if (this.idRecordDraw) {
          await this.pb.collection('drawing').delete(this.idRecordDraw);
          this.idRecordDraw = null
          this.drawUrl = ''
        }
      } else if (this.onDraw) {
        const formData = new FormData();
        formData.append('file', this.draw);
        formData.append('slot', this.slotNumber);
        formData.append('page', this.pageId);
        formData.append('signature', this.signature);

        if (!this.idRecordDraw) {
          const newDraw = await this.pb.collection('drawing').create(formData)
          this.idRecordDraw = newDraw.id
          this.drawUrl = this.getImageUrl(newDraw)
        } else {
          const newDraw = await this.pb.collection('drawing').update(this.idRecordDraw, formData)
          this.drawUrl = this.getImageUrl(newDraw)
        }
        if (this.idRecordText) {
          await this.pb.collection('text').delete(this.idRecordText);
          this.idRecordText = null
          this.text = ''
        }
      }


      this.onWrite = false;
      this.onDraw = false;
      this.onModify = false;
      this.onSignature = false;
    },
    saveDraw(e) {
      this.onSignature = true

      const byteCharacters = atob(e.split(',')[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      // Créer un objet Blob à partir du tableau d'octets
      const blob = new Blob([byteArray], { type: 'image/png' });

      // Créer un objet File à partir du Blob
      this.draw = new File([blob], 'image.png', { type: 'image/png' });
    },
    getImageUrl(data) {
      return this.$pocketBaseUrl + "api/files/" + data.collectionId + '/' + data.id + '/' + data.file
    },
  }
};
</script>

<style scoped>
</style>
