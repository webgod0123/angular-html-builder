import { Component } from '@angular/core';
import { BaseButtonRendererComponent } from '../../../layout-schema/base-components/base-button-renderer/base-button-renderer.component';
import { LayoutHandlerService } from '../../../services/layout-handler.service';

@Component({
  selector: 'render-email-button',
  templateUrl: './render-email-button.component.html',
})

export class RenderEmailButtonComponent extends BaseButtonRendererComponent {

  constructor(layoutHandlerService: LayoutHandlerService) {
    super(layoutHandlerService);
  }

}
