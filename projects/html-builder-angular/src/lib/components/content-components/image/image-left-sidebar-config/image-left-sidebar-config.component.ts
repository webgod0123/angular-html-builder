import { Component, Inject, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { IMAGE_FOLDER } from '../../../../config';
import { ContentComponentType } from '../../../../enums';
import { IHTMLBuilderService, IImageItem } from '../../../../interfaces';
import { HTML_BUILDER_SERVICE } from '../../../../providers/email-template-editor-service.provider';
import { EditorConfigService } from '../../../../services/editor-config.service';

@Component({
  selector: 'image-left-sidebar-config',
  templateUrl: './image-left-sidebar-config.component.html',
  styleUrls: ['./image-left-sidebar-config.component.scss'],
})

export class ImageLeftSideBarConfigComponent implements OnInit {

  isImageLoading = false;
  imageList: IImageItem[] = [];

  readonly ContentComponentType = ContentComponentType;

  constructor(
    @Inject(HTML_BUILDER_SERVICE) private readonly emailTemplateService: IHTMLBuilderService,
    private readonly editorConfigService: EditorConfigService,
  ) {

  }

  ngOnInit(): void {
    this.loadImages();
  }

  private loadImages() {
    this.isImageLoading = true;

    this.emailTemplateService.getImageList(IMAGE_FOLDER)
      .pipe(finalize(() => this.isImageLoading = false))
      .subscribe((images) => {
        this.imageList = images.items || [];
      });
  }

  getImagePath(url: string) {
    return this.editorConfigService.getImagePath(url);
  }

  onSelectImage(image: IImageItem) {
    return image;
  }

  setImageLoading(imageLoading: boolean) {
    this.isImageLoading = imageLoading;
  }

  uploadFile(url: string) {
    this.imageList.unshift(url);
  }

}
