export type IImageItem = string;

export interface IFolderedImageUpload {
  folderImagePath: string;
}

export interface IFolderedImageList {
  items: IImageItem[] | null;
}
