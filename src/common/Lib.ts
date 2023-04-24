import { Record } from "pocketbase";
import type { PageData, DrawData, TextData, StickerData, PhotoData } from './Interfaces';

export const leading = (num: number, size: number): string => {
  let string = num.toString();
  while (string.length < size) string = "0" + string;
  return string;
}

export const base64ToFile = (base64String: string): File => {
  const byteCharacters: string = atob(base64String.split(',')[1]);
  const byteNumbers: Array<any> = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray: Uint8Array = new Uint8Array(byteNumbers);
  const blob: Blob = new Blob([byteArray], { type: 'image/png' });
  return new File([blob], 'image.png', { type: 'image/png' });
}

export const getPageData = (record: Record): PageData => {
  return {
    id: record.id,
    collectionId: record.collectionId,
    file: record.file,
    pageNumber: record.pageNumber,
    template: record.template
  };
}

export const getTextData = (record: Record): TextData => {
  return {
    id: record.id,
    content: record.content,
    slot: record.slot,
    page: record.page,
    signature: record.signature
  };
}

export const getDefaultTextData = (pageId: string = '', slot: number = -1): TextData => {
  return {
    id: '',
    content: '',
    slot: slot,
    page: pageId,
    signature: ''
  };
}

export const getDrawData = (record: Record): DrawData => {
  return {
    id: record.id,
    collectionId: record.collectionId,
    file: record.file,
    slot: record.slot,
    page: record.page,
    signature: record.signature
  };
}

export const getDefaultDrawData = (pageId: string = '', slot:number = -1): DrawData => {
  return {
    id: '',
    collectionId: '',
    file: {} as File,
    slot: slot,
    page: pageId,
    signature: ''
  };
}

export const getStickerData = (record: Record): StickerData => {
  return {
    id: record.id,
    slot: record.slot,
    page: record.page,
    idSticker: record.idSticker
  };
}

export const getDefaultStickerData = (pageId: string = '', slot: number = -1): StickerData => {
  return {
    id: '',
    idSticker: -1,
    slot: slot,
    page: pageId,
  };
}

export const getPhotoData = (record: Record): PhotoData => {
  return {
    id: record.id,
    slot: record.slot,
    page: record.page,
    collectionId: record.collectionId,
    file: record.file
  };
}

export const getDefaultPhotoData = (pageId: string = '', slot: number = -1): PhotoData => {
  return {
    id: '',
    collectionId: '',
    file: {} as File,
    slot: slot,
    page: pageId
  };
}

export const getDrawFormData = (data: DrawData): FormData => {
  const formData: FormData = new FormData();
  formData.append('file', data.file);
  formData.append('slot', data.slot.toString());
  formData.append('page', data.page);
  formData.append('signature', data.signature);
  return formData
}
