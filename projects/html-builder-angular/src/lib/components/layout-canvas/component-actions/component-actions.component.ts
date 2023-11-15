import { Component, Input } from '@angular/core';
import { ComponentAction } from '../../../enums';
import { BuilderInterfaceService } from '../../../services/builder-interface.service';
import { LayoutHandlerService } from '../../../services/layout-handler.service';

@Component({
  selector: 'component-actions',
  templateUrl: './component-actions.component.html',
})
export class ComponentActionsComponent {

  @Input() locked: boolean;

  constructor(private layoutHandlerService: LayoutHandlerService, private builderInterfaceService: BuilderInterfaceService) { }

  get isTemplate(): boolean {
    return this.layoutHandlerService.isTemplate;
  }

  duplicate($event: MouseEvent) {
    $event.stopPropagation();
    this.layoutHandlerService.handleContentLayout(ComponentAction.DUPLICATE);
  }

  remove($event: MouseEvent) {
    $event.stopPropagation();
    this.layoutHandlerService.handleContentLayout(ComponentAction.REMOVE);
    this.builderInterfaceService.closeConfig();
  }

  lock($event: MouseEvent) {
    $event.stopPropagation();
    this.layoutHandlerService.handleContentLayout(ComponentAction.PADLOCK);
  }

  createComponent($event: MouseEvent) {
    $event.stopPropagation();
    this.layoutHandlerService.handleContentLayout(ComponentAction.ADD);
  }

}
