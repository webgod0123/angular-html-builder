import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseHeadRendererComponent } from '../../../layout-schema/base-components/base-head-renderer/base-head-renderer.component';
import { LayoutHandlerService } from '../../../services/layout-handler.service';

@Component({
  selector: 'render-html-head',
  templateUrl: './render-html-head.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RenderHtmlHeadComponent extends BaseHeadRendererComponent {

  constructor(layoutHandlerService: LayoutHandlerService) {
    super(layoutHandlerService);
  }

}
