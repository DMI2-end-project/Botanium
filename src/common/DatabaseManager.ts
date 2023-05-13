import PocketBase, {Record} from "pocketbase";
import type {PageData, TextData, DrawData, PhotoData, StickerData} from './Interfaces';
import {
  getPageData,
  getTextData,
  getDefaultTextData,
  getDrawData,
  getDrawFormData,
  getDefaultDrawData,
  getPhotoData,
  getDefaultPhotoData,
  getStickerData,
  getDefaultStickerData
} from './Lib';
import {ROLE} from "./Constants";
import {connectClient} from "../client";

class DatabaseManager {
  private static _instance: DatabaseManager;
  private pocketBaseUrl: string = "https://pocketbase-dmi2.fly.dev/";
  private _pocketbase: PocketBase = new PocketBase(this.pocketBaseUrl);
  private _roles: Record[] = [];
  
  private constructor() {
  }
  
  public static get Instance() {
    // Do you need arguments? Make it a regular static method instead.
    return this._instance || (this._instance = new this());
  }
  
  get pb() {
    return this._pocketbase;
  }
  
  async fetchRoles() {
    let roles = await this._pocketbase.collection('role').getFullList();
    this._roles = roles;
    return roles;
  }
  
  // Pages
  async fetchPages(): Promise<Array<PageData>> {
    const pages: Array<PageData> = [];
    const pagesRecord: Array<Record> = await this._pocketbase.collection('page').getFullList()
    pagesRecord.sort((a: Record, b: Record) => (a.pageNumber > b.pageNumber) ? 1 : ((b.pageNumber > a.pageNumber) ? -1 : 0))
    pagesRecord.forEach((pageRecord) => {
      pages.push(getPageData(pageRecord))
    })
    return pages
  }
  
  async createPage(pageNumber: number, template: number) {
    await this._pocketbase.collection('page').create({
      "pageNumber": pageNumber,
      "template": template,
    });
  }
  
  // Text
  async fetchText(pageId: string, slot: number): Promise<TextData> {
    let textData: TextData = getDefaultTextData(pageId, slot);
    await this._pocketbase.collection('text').getFirstListItem('page="' + pageId + '" && slot=' + slot + '').then((result: Record) => {
      textData = getTextData(result)
    }).catch(error => {
      // console.error(error.message)
    })
    return textData;
  }
  
  async createText(data: TextData): Promise<TextData> {
    const record = await this._pocketbase.collection('text').create({
      "page": data.page,
      "slot": data.slot,
      "content": data.content,
      "signature": data.signature
    });
    return getTextData(record);
  }
  
  async updateText(data: TextData): Promise<TextData> {
    const record = await this._pocketbase.collection('text').update(data.id, {
      "page": data.page,
      "slot": data.slot,
      "content": data.content,
      "signature": data.signature
    });
    return getTextData(record);
  }
  
  async deleteText(data: TextData) {
    await this._pocketbase.collection('text').delete(data.id);
  }
  
  // Draw
  async fetchDraw(pageId: string, slot: number): Promise<DrawData> {
    let drawData: DrawData = getDefaultDrawData(pageId, slot);
    await this._pocketbase.collection('drawing').getFirstListItem('page="' + pageId + '" && slot=' + slot + '').then((result: Record) => {
      drawData = getDrawData(result)
    }).catch(error => {
      // console.error(error.message)
    })
    return drawData;
  }
  
  async createDraw(data: DrawData): Promise<DrawData> {
    const record = await this._pocketbase.collection('drawing').create(getDrawFormData(data));
    return getDrawData(record);
  }
  
  async updateDraw(data: DrawData): Promise<DrawData> {
    const record = await this._pocketbase.collection('drawing').update(data.id, getDrawFormData(data));
    return getDrawData(record);
  }
  
  async deleteDraw(data: DrawData) {
    await this._pocketbase.collection('drawing').delete(data.id);
  }
  
  // Photo
  async fetchPhoto(pageId: string, slot: number): Promise<PhotoData> {
    let photoData: PhotoData = getDefaultPhotoData(pageId, slot);
    await this._pocketbase.collection('photo').getFirstListItem('page="' + pageId + '" && slot=' + slot + '').then((result: Record) => {
      photoData = getPhotoData(result)
    }).catch(error => {
      // console.error(error.message)
    })
    return photoData;
  }
  
  async fetchPhotos(filter: string): Promise<PhotoData[]> {
    let photoData: PhotoData[] = [];
    await this._pocketbase.collection('photo').getFullList(200 /* batch size */, {
      sort: '-created',
      filter: filter,
    }).then((result: Record[]) => {
      result.forEach((r: Record) => {
        photoData.push(getPhotoData(r))
      });
    }).catch(error => {
      // console.error(error.message)
    })
    return photoData;
  }
  
  async updatePhoto(data: PhotoData): Promise<PhotoData> {
    const record = await this._pocketbase.collection('photo').update(data.id, data);
    return getPhotoData(record);
  }
  
  // Sticker
  async fetchSticker(pageId: string, slot: number): Promise<StickerData> {
    let stickerData: StickerData = getDefaultStickerData(pageId, slot);
    await this._pocketbase.collection('sticker').getFirstListItem('page="' + pageId + '" && slot=' + slot + '').then((result: Record) => {
      stickerData = getStickerData(result)
    }).catch(error => {
      // console.error(error.message)
    })
    return stickerData;
  }
  
  async createSticker(data: StickerData): Promise<StickerData> {
    const record = await this._pocketbase.collection('sticker').create(data);
    return getStickerData(record);
  }
  
  async deleteSticker(data: StickerData) {
    await this._pocketbase.collection('sticker').delete(data.id);
  }
  
  
  getImageUrl(data: DrawData | PhotoData): string {
    return data.id !== '' ? this.pocketBaseUrl + "api/files/" + data.collectionId + '/' + data.id + '/' + data.file : ''
  }
  
  get roles() {
    return this._roles;
  }
}

export const DatabaseManagerInstance = DatabaseManager.Instance;

//export default DatabaseManager;
