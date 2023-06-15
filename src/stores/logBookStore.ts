import { defineStore } from "pinia";
import { DatabaseManagerInstance } from "../common/DatabaseManager";
import { DrawData, PageData, PhotoData } from "../common/Interfaces";
import { getDefaultDrawData } from "../common/Lib";

export type StoreState = {
  pages: PageData[],
  photos: PhotoData[],
  draws: DrawData[],

  isClosable: boolean,
  closeElements: boolean,
};

export const useLogBookStore = defineStore('logBook', {
  state: (): StoreState => ({
    pages: [],
    photos: [],
    draws: [],
    isClosable: false,
    closeElements: false
  }),
  getters: {
    photosNotUsed(): PhotoData[] {
      let photos = this.photos
      photos = photos.filter((p) => {
        return p.page === ''
      })
      return photos
    }
  },
  actions: {
    async fetchPages(roomId:string)  {
      this.pages = await DatabaseManagerInstance.fetchPages(roomId);
    },
    async createPage(pageNumber: number, template: number, classroomId: string) {
      const pageData = await DatabaseManagerInstance.createPage(pageNumber, template, classroomId);
      this.pages.push(pageData)
    },
    async fetchPhotos(roomId: string) {
      this.photos = await DatabaseManagerInstance.fetchPhotos('classroom="' + roomId + '"')
    },
    async updatePhoto(photo: PhotoData): Promise<PhotoData> {
      let photoIndex = this.photos.findIndex((p) => photo.id === p.id);
      this.photos[photoIndex] = photo
      return await DatabaseManagerInstance.updatePhoto(photo)
    },
    async fetchDraws(roomId: string) {
      this.draws = await DatabaseManagerInstance.fetchDraws(roomId)
    },
    draw(pageId: string, slot: number, roomId: string): DrawData {
      const findDraw = this.draws.find((draw) => draw.page === pageId && draw.slot === slot)
      return findDraw ? findDraw : getDefaultDrawData(pageId, slot, roomId)
    },
    async updateDraw(draw: DrawData): Promise<DrawData> {
      let drawIndex = this.draws.findIndex((d) => draw.id === d.id);
      const drawRecord = await DatabaseManagerInstance.updateDraw(draw)
      this.draws[drawIndex] = drawRecord
      return drawRecord
    },
    async createDraw(draw: DrawData): Promise<DrawData> {
      const drawRecord = await DatabaseManagerInstance.createDraw(draw)
      this.draws.push(drawRecord)
      return drawRecord
    },
    async deleteDraw(draw: DrawData) {
      let drawIndex = this.draws.findIndex((d) => draw.id === d.id);
      this.draws.splice(drawIndex, 1)
      await DatabaseManagerInstance.deleteDraw(draw)
    },
    reset() {
      this.pages = []
      this.photos = []
      this.draws = []
      this.isClosable = false;
      this.closeElements = false;
    }
  }
})
