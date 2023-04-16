<template>
  <button class="image-element w-full h-full bg-gray-100 p-0" :class="classProperty + ' ' + (image ? 'bg-transparent' : '')" @click="modify">
    <div v-if="image" class="relative flex justify-center max-w-full max-h-full" :style="'transform: rotate(' + rotate + 'deg)'">
      <div class="w-16 h-4 bg-purple-600/75 absolute -top-2 z-10"></div>
      <img :src="image" class="image max-h-full max-w-full object-contain bg-white border-4 border-white drop-shadow-lg">
    </div>
    <p v-if="!image">image</p>
  </button>
  <div v-if="onModify" class="fixed z-40 w-screen h-screen top-0 left-0 flex items-end">
      <div class="relative h-5/6 mt-auto w-fit flex items-center" :class="isPageLeft ? 'ml-auto' : 'mr-auto'">
        <button v-if="imageSelected" @click="saveData" class="absolute z-10 h-24 w-24 top-0 bottom-0 my-auto h-fit rounded-full" :class="isPageLeft ? '-left-12' : '-right-12'">Valider</button>
        <div class="bg-white p-8 h-full" :class="isPageLeft ? '' : 'scroll-left'">
          <div class="overflow-y-scroll h-full">
            <div class="grid grid-cols-3 gap-8 mt-10 mx-8">
              <div v-for="image in imageList" :v-bind="image" class="w-48 h-48 flex justify-center items-center">
                <button @click="changeImage(image)" class="p-0 overflow-hidden">
                  <img :src="getImageUrl(image)" class="object-contain w-full h-full pointer-events-none">
                </button>
              </div>
            </div>
          </div>
        </div>
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
    },
    classProperty: {
      type: String,
      default: null
    },
    isPageLeft: {
      type: Boolean,
      default: false
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
      rotate: 0,
    }
  },
  mounted() {
    this.pb.collection('photo').getFirstListItem('page="' + this.pageId + '" && slot=' + this.slotNumber + '').then(result => {
      this.idRecord = result.id
      this.updateRotate()
      this.image = this.getImageUrl(result);
    }).catch(error => {
      console.error(error.message)
    })
  },
  watch: {
    onModify(value) {
      this.$emit('onModify', value)
    }
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
    changeImage(image) {
      this.imageSelected = image
      this.image = this.getImageUrl(this.imageSelected)
      this.updateRotate()
    },
    updateRotate() {
      this.rotate = (Math.random() - 0.5) * 10;
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

      await this.pb.collection('photo').update(this.imageSelected.id, data);

      if (this.idRecord) {
        await this.pb.collection('photo').update(this.idRecord, dataDelete);
      }

      this.idRecord = this.imageSelected.id
      this.image = this.getImageUrl(this.imageSelected)
      this.imageSelected = null
      this.onModify = false;
    }
  }
};
</script>

<style scoped>

.scroll-left {
  direction:ltr;
}

.scroll-left > * {
  direction: rtl;
}

  /* Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: #4D6B36 #85A754;
}

/* Chrome, Edge and Safari */
*::-webkit-scrollbar {
  width: 8px;
  width: 8px;
  margin: 10px;
}
*::-webkit-scrollbar-track {
  border-radius: 20px;
  background-color: #85A754;
  border: 0 solid #FFFFFF;
}

*::-webkit-scrollbar-track:hover {
  background-color: #8FB45A;
}

*::-webkit-scrollbar-track:active {
  background-color: #8FB45A;
}

*::-webkit-scrollbar-thumb {
  border-radius: 20px;
  background-color: #4D6B36;
}

*::-webkit-scrollbar-thumb:hover {
  background-color: #57793D;
}

*::-webkit-scrollbar-thumb:active {
  background-color: #57793D;
}
</style>
