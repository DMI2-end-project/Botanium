<template>
  <div class="w-screen h-screen">
    <video ref="next" width="100" muted="true" autoplay>
        <source src="/log-book/next.webm" type="video/webm">
    </video>
    <video ref="previous" width="100" muted="true" autoplay>
        <source src="/log-book/previous.webm" type="video/webm">
    </video>
    <video ref="open" width="100" class="first -translate-x-[17.5%]" muted="true" autoplay>
        <source src="/log-book/open.webm" type="video/webm">
    </video>
    <div class="content z-[0]">
      <div class="book-content">
        <div ref="shadow" class="video-shadow absolute inset-0 top-[15%] m-auto bg-black/40 blur-lg w-[65%] h-[75%] -z-10" />
      </div>
    </div>
    <div class="content z-20">
      <div class="book-content" :class="onModify ? 'z-50' : 'z-10'">
        <div ref="pageLeft" class="page page-left flex">
          <!-- <p class="absolute -bottom-6">page {{ pageNumber - 1 }}</p> -->
          <div v-if="lastPage === pageNumber - 1" class="m-auto">
            <RoundButton class="m-auto drop-shadow-lg" @click="addPage" :size="SIZE.LG" :color="COLOR.GREEN_MEDIUM"><img src="../../assets/images/plus.png" class="p-6"></RoundButton>
            <p class="font-bold mt-2">Ajouter une page</p>
          </div>
          <Transition name="texture-book">
            <PageContent v-show="pagesContent[pageNumber - 2]" :content="pagesContent[pageNumber - 2]" @onModify="onModify = $event" />
          </Transition>
        </div>
        <div ref="pageRight" class="page page-right flex">
          <!-- <p class="absolute -bottom-6">page {{ pageNumber }}</p> -->
          <div v-if="lastPage === pageNumber" class="m-auto">
            <RoundButton class="m-auto drop-shadow-lg" @click="addPage" :size="SIZE.LG" :color="COLOR.GREEN_MEDIUM"><img src="../../assets/images/plus.png" class="p-6"></RoundButton>
            <p class="font-bold mt-2">Ajouter une page</p>
          </div>
          <Transition name="texture-book-2">
            <PageContent v-show="pagesContent[pageNumber - 1]" :content="pagesContent[pageNumber - 1]" @onModify="onModify = $event" />
          </Transition>
        </div>
      </div>
      <RoundButton class="open" :class="disableOpen ? 'disable' : ''" ref="buttonOpen" @click="openTheBook"><Play /></RoundButton>
      <RoundButton v-if="(pageNumber < lastPage) && isBookOpen" class="next" ref="buttonNext" @click="nextPage" :size="SIZE.SM" :color="COLOR.GREEN_LIGHT"><Arrow class="rotate-180" /></RoundButton>
      <RoundButton v-if="(page > 2) && isBookOpen" class="previous" ref="buttonPrevious" @click="previousPage" :size="SIZE.SM" :color="COLOR.GREEN_LIGHT"><Arrow /></RoundButton>
      <AddPage v-if="onPageAdd" :page:="lastPage" @close="onCloseAddPage" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {useMainStore} from "./../../stores/mainStore";
import {useLogBookStore} from "./../../stores/logBookStore";
import PageContent from './PageContent.vue';
import AddPage from './AddPage.vue';
import {DatabaseManagerInstance} from "./../../common/DatabaseManager";
import type { PageData } from './../../common/Interfaces'
import RoundButton from './../common/RoundButton.vue'
import { COLOR, SIZE } from "./../../common/Constants";
import Arrow from "./../../assets/svg/ico-chevron.svg?component";
import Play from "./../../assets/svg/ico-play.svg?component";

export default defineComponent({
  name: "BookComponent",
  components: {
    PageContent,
    AddPage,
    RoundButton,
    Arrow,
    Play
  },
  data: () => {
    return {
      mainStore: useMainStore(),
      logBookStore: useLogBookStore(),
      lastPage: 1 as number,
      page: 1 as number,
      isBookOpen: false as Boolean,
      onPageAdd: false as Boolean,
      onModify: false as Boolean,
      pagesContent: [] as Array<PageData>,
      openVideo: undefined as HTMLVideoElement | undefined,
      nextVideo: undefined as HTMLVideoElement | undefined,
      previousVideo: undefined as HTMLVideoElement | undefined,
      shadow: undefined as HTMLElement | undefined,
      disableOpen: false,
      pageLeft: undefined as HTMLElement | undefined,
      pageRight: undefined as HTMLElement | undefined,
    }
  },
  computed: {
    pageNumber():number {
      return (this.page % 2) + this.page
    },
    COLOR() {
      return COLOR
    },
    SIZE() {
      return SIZE
    },
  },
  async mounted() {
    await this.getPages()
    this.openVideo = this.$refs.open as HTMLVideoElement;
    this.nextVideo = this.$refs.next as HTMLVideoElement;
    this.previousVideo = this.$refs.previous as HTMLVideoElement;
    this.shadow = this.$refs.shadow as HTMLElement;
    this.pageLeft = this.$refs.pageLeft as HTMLElement;
    this.pageRight = this.$refs.pageRight as HTMLElement;
    this.openVideo?.pause();
  },
  methods: {
    async getPages() {
      if (this.logBookStore.pages.length === 0 || this.pagesContent.length > 0) return
      this.pagesContent = this.logBookStore.pages;
      this.lastPage = this.page = this.pagesContent.length + 1
    },
    openTheBook () {
      this.openVideo?.play();
      this.openVideo?.classList.add("is-open")
      this.shadow?.classList.add("is-open")
      this.disableOpen = true;
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
      if (!this.mainStore.roomId || n < 0) return
      await this.logBookStore.createPage(this.lastPage, n, this.mainStore.roomId);
      this.pagesContent = this.logBookStore.pages;
      this.lastPage = this.pagesContent.length + 1;
    }
  },
});
</script>

<style scoped>
video {
  position: fixed;
  width: auto;
  height: 100vh;
  inset: 0;
  margin: auto;
  z-index: 1;
  opacity: 0;
}

video.first {
  z-index: 2;
  opacity: 1;
  transition: transform 1s ease;
}

.video-shadow {
  transform: scaleX(51%) translateX(-2%);
  /* transition: transform 1s ease; */
}

.video-shadow.is-open {
  transform: scaleX(100%) translateX(0);
  animation: open 1.4s ease forwards;
}

@keyframes open {
  0% {
    transform: scaleX(51%) translateX(-2%);
  }
  20% {
    opacity: 0;
  }
  60% {
    transform: scaleX(51%) translateX(25%);
    opacity: 0;
  }
  70% {
    opacity: 0;
  }
  100% {
    transform: scaleX(100%) translateX(0);
    opacity: 1;
  }
}

video.is-open {
  transform: translate(0);
}

.content {
  position: fixed;
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
  margin-left: 0%;
  margin-top: 8%;
}

button.next {
  position: absolute;
  margin-left: calc(60% + 100px);
}

button.previous {
  position: absolute;
  margin-left: calc(-60% - 100px);
}

.book-content {
  position: absolute;
  max-width: 100vw;
  max-height: 56.5vw;
  height: 100vh;
  width: 177vh;
  margin: auto;
}
.book-content-container {
  width: 100%;
  height: 100%;
  max-height: 100vh;
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto;
}

.book-content .page {
  width: 27%;
  height: 65%;
  position: absolute;
  inset:0;
  margin: auto;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.book-content .page-active {
  opacity: 1;
}

.book-content .page-left {
  /* transform: translate(-65%, 4%); */
  left: -30%;
  top: 11%;
}

.book-content .page-right {
  /* transform: translate(55%, 4%); */
  left: 31%;
  top: 11%;
}

</style>
