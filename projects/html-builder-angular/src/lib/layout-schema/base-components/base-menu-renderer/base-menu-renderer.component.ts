import { Component } from '@angular/core';
import { SiteAction } from '../../../enums';
import { LayoutHandlerService } from '../../../services/layout-handler.service';
import { IMenuItem, IMenuValue, MenuLayout } from '../../layout-schema.interface';
import { BaseRendererComponent } from '../base-renderer.component';

@Component({
  template: '',
})
export abstract class BaseMenuRendererComponent extends BaseRendererComponent<IMenuValue> {

  constructor(layoutHandlerService: LayoutHandlerService) {
    super(layoutHandlerService);
  }

  getDisplay(layout: MenuLayout): 'block' | 'inline-block' {
    if (layout === 'horizontal') {
      return 'inline-block';
    } else {
      return 'block';
    }
  }

  href(menuItem: IMenuItem) {
    let href = '';
    switch (menuItem.actionType) {
      case SiteAction.WEBSITE:
        href = menuItem.href ? menuItem.href : '';
        break;
      case SiteAction.EMAIL:
        href = menuItem.emailTo
          ? `mailto:${menuItem.emailTo}?subject=${menuItem.subject}&body=${menuItem.body}`
          : '';
        break;
      case SiteAction.PHONE:
        href = menuItem.phone ? `tel:${menuItem.phone}` : '';
    }

    return href;
  }


}
