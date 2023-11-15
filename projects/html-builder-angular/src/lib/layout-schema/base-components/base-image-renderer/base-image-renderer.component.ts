import { Component } from '@angular/core';
import { LayoutHandlerService } from '../../../services/layout-handler.service';
import { IImageValue } from '../../layout-schema.interface';
import { BaseRendererComponent } from '../base-renderer.component';
import { SiteAction } from '../../../enums/site-action.enum';

@Component({
  template: '',
})
export abstract class BaseImageRendererComponent extends BaseRendererComponent<IImageValue> {

  readonly SiteAction = SiteAction;

  constructor(layoutHandlerService: LayoutHandlerService) {
    super(layoutHandlerService);
  }

  imageHref() {
    let href = '';
    switch (this.value.action) {
      case SiteAction.WEBSITE:
        href = this.value.href ? this.value.href : '';
        break;
      case SiteAction.EMAIL:
        href = this.value.emailTo
          ? `mailto:${this.value.emailTo}?subject=${this.value.subject}&body=${this.value.body}`
          : '';
        break;
      case SiteAction.PHONE:
        href = this.value.phone ? `tel:${this.value.phone}` : '';
    }

    return href;
  }

}
