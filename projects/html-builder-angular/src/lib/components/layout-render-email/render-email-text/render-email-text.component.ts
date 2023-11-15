import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseTextRendererComponent } from '../../../layout-schema/base-components/base-text-renderer/base-text-renderer.component';
import { LayoutHandlerService } from '../../../services/layout-handler.service';

@Component({
  selector: 'render-email-text',
  templateUrl: './render-email-text.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RenderEmailTextComponent extends BaseTextRendererComponent {

  constructor(layoutHandlerService: LayoutHandlerService) {
    super(layoutHandlerService);
  }

}
