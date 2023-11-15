import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseHtmlRendererComponent } from '../../../layout-schema/base-components/base-html-renderer/base-html-renderer.component';
import { LayoutHandlerService } from '../../../services/layout-handler.service';

@Component({
  selector: 'render-email-html',
  templateUrl: './render-email-html.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RenderEmailHtmlComponent extends BaseHtmlRendererComponent {

  constructor(layoutHandlerService: LayoutHandlerService) {
    super(layoutHandlerService);
  }

}
