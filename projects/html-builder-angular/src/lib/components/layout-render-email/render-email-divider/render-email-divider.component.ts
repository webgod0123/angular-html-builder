import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LayoutHandlerService } from '../../../services/layout-handler.service';
import { BaseDividerRendererComponent } from '../../../layout-schema/base-components/base-divider-renderer/base-divider-renderer.component';

@Component({
  selector: 'render-email-divider',
  templateUrl: './render-email-divider.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RenderEmailDividerComponent extends BaseDividerRendererComponent {

  constructor(layoutHandlerService: LayoutHandlerService) {
    super(layoutHandlerService);
  }

}
