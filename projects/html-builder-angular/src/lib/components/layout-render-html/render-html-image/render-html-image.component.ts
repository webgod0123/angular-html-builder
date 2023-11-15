import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseImageRendererComponent } from '../../../layout-schema/base-components/base-image-renderer/base-image-renderer.component';
import { LayoutHandlerService } from '../../../services/layout-handler.service';

@Component({
  selector: 'render-html-image',
  templateUrl: './render-html-image.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class RenderHtmlImageComponent extends BaseImageRendererComponent {

  constructor(layoutHandlerService: LayoutHandlerService) {
    super(layoutHandlerService);
  }

}
