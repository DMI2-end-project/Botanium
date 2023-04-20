<template>
  <div>
    <video ref="next" width="100" muted autoplay>
        <source src="./../../assets/log-book/next.mp4" type="video/mp4">
    </video>
    <video ref="previous" width="100" muted autoplay>
        <source src="./../../assets/log-book/previous.mp4" type="video/mp4">
    </video>
    <video ref="open" width="100" muted autoplay>
        <source src="./../../assets/log-book/open.mp4" type="video/mp4">
    </video>
    <div class="content">
      <div class="book-content" :class="onModify ? 'z-50' : 'z-10'">
        <div ref="pageLeft" class="page page-left flex">
          <p class="absolute -bottom-6">page {{ pageNumber - 1 }}</p>
          <button v-if="lastPage === pageNumber - 1" class="m-auto" @click="addPage">+</button>
          <PageContent v-else-if="pagesContent[pageNumber - 2]" :content="pagesContent[pageNumber - 2]" @onModify="onModify = $event" />
        </div>
        <div ref="pageRight" class="page page-right flex">
          <p class="absolute -bottom-6">page {{ pageNumber }}</p>
          <button v-if="lastPage === pageNumber" class="m-auto" @click="addPage">+</button>
          <PageContent v-else-if="pagesContent[pageNumber - 1]" :content="pagesContent[pageNumber - 1]" @onModify="onModify = $event" />
        </div>
      </div>
      <button class="open" ref="buttonOpen" @click="openTheBook">Ouvrir le livre</button>
      <button v-if="(pageNumber < lastPage) && isBookOpen" class="next" ref="buttonNext" @click="nextPage">Suivant</button>
      <button v-if="(page > 2) && isBookOpen" class="previous" ref="buttonPrevious" @click="previousPage">Précédent</button>
      <AddPage v-if="onPageAdd" :page:="lastPage" @close="onCloseAddPage" />
    </div>
  </div>
</template>

<script lang="ts">
import PageContent from './PageContent.vue';
import AddPage from './AddPage.vue';
import {DatabaseManagerInstance} from "./../../common/DatabaseManager";
import Client from 'pocketbase';
import type { PageData } from './../../common/Interfaces'

export default {
  name: "BookComponent",
  components: {
    PageContent,
    AddPage
  },
  data: () => {
    return {
      pb: DatabaseManagerInstance.pb as Client,
      lastPage: 1 as number,
      page: 1 as number,
      isBookOpen: false as Boolean,
      onPageAdd: false as Boolean,
      onModify: false as Boolean,
      pagesContent: [] as Array<PageData>,
      openVideo:  undefined as HTMLVideoElement | undefined,
      nextVideo:  undefined as HTMLVideoElement | undefined,
      previousVideo:  undefined as HTMLVideoElement | undefined,
      buttonOpen:  undefined as HTMLButtonElement | undefined,
      pageLeft:  undefined as HTMLElement | undefined,
      pageRight:  undefined as HTMLElement | undefined,
    }
  },
  computed: {
    pageNumber():number {
      return (this.page % 2) + this.page
    }
  },
  async mounted() {
    this.openVideo = this.$refs.open as HTMLVideoElement;
    this.nextVideo = this.$refs.next as HTMLVideoElement;
    this.previousVideo = this.$refs.previous as HTMLVideoElement;
    this.buttonOpen = this.$refs.buttonOpen as HTMLButtonElement;
    this.pageLeft = this.$refs.pageLeft as HTMLElement;
    this.pageRight = this.$refs.pageRight as HTMLElement;
    this.openVideo?.pause();
    this.pagesContent = await DatabaseManagerInstance.fetchPages();
    this.lastPage = this.page = this.pagesContent.length + 1
  },
  methods: {
    openTheBook () {
      this.openVideo?.play();
      this.buttonOpen?.classList.add("disable");
      this.isBookOpen = true;
      this.updateContentPage(2400, 0);
    },
    nextPage () {
      this.nextVideo?.play();
      this.nextVideo?.classList.add("first");
      this.previousVideo?.classList.remove("first");
      this.openVideo?.classList.remove("first");
      this.updateContentPage(1200, +2);
    },
    previousPage () {
      this.previousVideo?.play();
      this.previousVideo?.classList.add("first");
      this.nextVideo?.classList.remove("first");
      this.openVideo?.classList.remove("first");
      this.updateContentPage(1200, -2);
    },
    updateContentPage (timeout:number, delta:number) {
      this.pageLeft?.classList.remove("page-active");
      this.pageRight?.classList.remove("page-active");
      setTimeout(() => {
        this.page = this.page + delta
      }, timeout/2)
      setTimeout(() => {
        this.pageLeft?.classList.add("page-active");
        this.pageRight?.classList.add("page-active");
      }, timeout)
    },
    addPage() {
      this.onPageAdd = true
    },
    async onCloseAddPage(n:number) {
      this.onPageAdd = false
      await DatabaseManagerInstance.createPage(this.lastPage, n);
      this.pagesContent = await DatabaseManagerInstance.fetchPages();
      this.lastPage = this.pagesContent.length + 1
    }
  },
};
</script>

<style scoped>
video {
  position: fixed;
  width: 100%;
  height: auto;
  inset: 0;
  margin: auto;
  z-index: 1;
}

video.first {
  z-index: 2;
}
.content {
  position: fixed;
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  inset: 0;
  margin: auto;
}

button {
  z-index: 30;
}

button.disable {
  opacity: 0;
  pointer-events: none;
}

button.open {
  margin-left: 18%;
}

button.next {
  position: absolute;
  margin-left: calc(40% + 100px);
}

button.previous {
  position: absolute;
  margin-left: calc(-40% - 150px);
}

.book-content {
  position: absolute;
  width: 100vw;
  height: 0;
  padding-bottom: 56.5%;
  inset: 0;
  margin: auto;
}

.book-content .page {
  width: 15%;
  height: 40%;
  position: absolute;
  inset:0;
  margin: auto;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.book-content .page-active {
  opacity: 1;
}

.book-content .page-left {
  /* transform: translate(-65%, 4%); */
  left: -19%;
  top: 4%;
}

.book-content .page-right {
  /* transform: translate(55%, 4%); */
  left: 16%;
  top: 4%;
}

</style>
