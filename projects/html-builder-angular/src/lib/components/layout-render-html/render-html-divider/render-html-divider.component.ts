import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseDividerRendererComponent } from '../../../layout-schema/base-components/base-divider-renderer/base-divider-renderer.component';
import { LayoutHandlerService } from '../../../services/layout-handler.service';

@Component({
  selector: 'render-html-divider',
  templateUrl: './render-html-divider.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RenderHtmlDividerComponent extends BaseDividerRendererComponent {

  constructor(layoutHandlerService: LayoutHandlerService) {
    super(layoutHandlerService);
  }

}
