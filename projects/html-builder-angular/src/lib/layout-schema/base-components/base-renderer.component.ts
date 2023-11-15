import { Component, Input } from '@angular/core';
import { LayoutHandlerService } from '../../services/layout-handler.service';
import { CustomValues } from '../layout-schema.interface';

/**
 * Base logic needed for all rendered components.
 */
@Component({
  template: '',
})
export abstract class BaseRendererComponent<T extends CustomValues> {

  @Input() id: string;
  @Input() value: T;

  constructor(private _layoutHandlerService: LayoutHandlerService) { }

  onBlockClick($event: MouseEvent) {
    $event.stopPropagation();
    this._layoutHandlerService.handleBlockSelect(this.id);
  }

  onLinkClick($event: MouseEvent): void {
    $event.preventDefault();
  }

}
