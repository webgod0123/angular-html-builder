import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseRendererComponent } from '../../../layout-schema/base-components/base-renderer.component';
import { IVariableValue } from '../../../layout-schema/layout-schema.interface';
import { LayoutHandlerService } from '../../../services/layout-handler.service';

@Component({
  selector: 'render-email-variable',
  templateUrl: './render-email-variable.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RenderEmailVariableComponent extends BaseRendererComponent<IVariableValue> {

  constructor(layoutHandlerService: LayoutHandlerService) {
    super(layoutHandlerService);
  }

}
