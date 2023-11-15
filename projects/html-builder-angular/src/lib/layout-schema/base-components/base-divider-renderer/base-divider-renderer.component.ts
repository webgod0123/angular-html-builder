import { Component } from '@angular/core';
import { LayoutHandlerService } from '../../../services/layout-handler.service';
import { IDividerValues } from '../../layout-schema.interface';
import { BaseRendererComponent } from '../base-renderer.component';

@Component({
  template: '',
})
export abstract class BaseDividerRendererComponent extends BaseRendererComponent<IDividerValues> {

  constructor(layoutHandlerService: LayoutHandlerService) {
    super(layoutHandlerService);
  }

}
