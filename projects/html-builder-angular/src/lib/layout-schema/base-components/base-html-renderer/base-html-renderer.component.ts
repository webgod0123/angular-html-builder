import { Component } from '@angular/core';
import { LayoutHandlerService } from '../../../services/layout-handler.service';
import { IHtmlValue } from '../../layout-schema.interface';
import { BaseRendererComponent } from '../base-renderer.component';

@Component({
  template: '',
})
export abstract class BaseHtmlRendererComponent extends BaseRendererComponent<IHtmlValue> {

  constructor(layoutHandlerService: LayoutHandlerService) {
    super(layoutHandlerService);
  }

}
