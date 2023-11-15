import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IVariableValue } from '../../../layout-schema/layout-schema.interface';
import { LayoutHandlerService } from '../../../services/layout-handler.service';
import { BaseRendererComponent } from '../../../layout-schema/base-components/base-renderer.component';

@Component({
  selector: 'render-html-variable',
  templateUrl: './render-html-variable.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RenderHtmlVariableComponent extends BaseRendererComponent<IVariableValue> {

  constructor(layoutHandlerService: LayoutHandlerService) {
    super(layoutHandlerService);
  }

}
