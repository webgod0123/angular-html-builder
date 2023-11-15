import { Component } from '@angular/core';
import { CKEditor5 } from '@ckeditor/ckeditor5-angular';
import { BaseButtonRendererComponent } from '../../../layout-schema/base-components/base-button-renderer/base-button-renderer.component';
import { LayoutHandlerService } from '../../../services/layout-handler.service';

@Component({
  selector: 'render-html-button',
  templateUrl: './render-html-button.component.html',
})

export class RenderHtmlButtonComponent extends BaseButtonRendererComponent {

  readonly editorToolbarConfig: CKEditor5.Config = {
    toolbar: {
      items: [
        'bold',
        'italic',
        'underline',
        'strikethrough',
      ],
    },
  };

  constructor(layoutHandlerService: LayoutHandlerService) {
    super(layoutHandlerService);
  }

}
