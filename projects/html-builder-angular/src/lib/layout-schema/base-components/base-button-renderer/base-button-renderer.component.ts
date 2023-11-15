import { Component } from '@angular/core';
import { SiteAction } from '../../../enums/site-action.enum';
import { LayoutHandlerService } from '../../../services/layout-handler.service';
import { IButtonValue } from '../../layout-schema.interface';
import { BaseRendererComponent } from '../base-renderer.component';

@Component({
  template: '',
})
export abstract class BaseButtonRendererComponent extends BaseRendererComponent<IButtonValue> {

  constructor(private layoutHandlerService: LayoutHandlerService) {
    super(layoutHandlerService);
  }

  updateButtonBlockText(text: string) {
    this.layoutHandlerService.updateButtonBlockText(this.id, text);
  }

  href() {
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
        break;
      case SiteAction.VARIABLE:
        href = this.value.variable ? this.value.variable : '';
    }

    return href;
  }

}
