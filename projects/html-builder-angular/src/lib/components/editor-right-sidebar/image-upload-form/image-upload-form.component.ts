import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { IMAGE_FOLDER } from '../../../config';
import { IHTMLBuilderService } from '../../../interfaces';
import { HTML_BUILDER_SERVICE } from '../../../providers/email-template-editor-service.provider';

@Component({
  selector: 'image-upload-form',
  templateUrl: './image-upload-form.component.html',
})

export class ImageUploadFormComponent {

  @Output() uploadImageFile = new EventEmitter();
  @Output() imageLoading = new EventEmitter();
  isImageLoading = false;

  constructor(
    @Inject(HTML_BUILDER_SERVICE) private readonly htmlBuilderService: IHTMLBuilderService,
  ) { }

  uploadFile(event: Event) {
    const target = (event.target as HTMLInputElement);

    if (!target.files?.length) {
      return;
    }

    const file = target.files[0];

    if (!file) {
      return;
    }

    this.imageLoading.emit(true);

    this.htmlBuilderService.uploadImage(IMAGE_FOLDER, file)
      .pipe(finalize(() => this.imageLoading.emit(false)))
      .subscribe((value) => {
        const url = value.folderImagePath;
        this.uploadImageFile.emit(url);
        target.value = '';
      });
  }

}
