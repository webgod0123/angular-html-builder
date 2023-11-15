import { Component, Input } from '@angular/core';
import { DndDropEvent } from 'ngx-drag-drop';
import { ContentComponentType } from '../../../enums';
import { BuilderInterfaceService } from '../../../services/builder-interface.service';
import { LayoutHandlerService } from '../../../services/layout-handler.service';
import { IBody } from '../../layout-schema.interface';
import { getStyleTag } from '../../renderer/style-tag-helper';

@Component({
  template: '',
})

export abstract class BaseBodyRendererComponent {

  @Input() layoutJson: IBody;

  readonly dropZoneFor = this.layoutHandlerService.isTemplate ?
    [
      ContentComponentType.BLOCK,
      ContentComponentType.TEXT,
      ContentComponentType.DIVIDER,
      ContentComponentType.IMAGE,
      ContentComponentType.VARIABLE,
      ContentComponentType.MENU,
      ContentComponentType.BUTTON,
      ContentComponentType.HEAD,
      ContentComponentType.HTML,
      ContentComponentType.DIVIDER,
      ContentComponentType.EVENT,
    ] : [];

  readonly getStyleTag = getStyleTag;

  constructor(
    private layoutHandlerService: LayoutHandlerService,
    private builderInterfaceService: BuilderInterfaceService
  ) { }

  onDrop(event: DndDropEvent) {
    this.layoutHandlerService.handleCanvasDrop(event.type, event.index, event.data, event.dropEffect);
  }

  onRowClick($event: MouseEvent, rowId: string) {
    $event.stopPropagation();
    this.layoutHandlerService.handleBlockSelect(rowId);
  }

  onBodyClick($event: MouseEvent) {
    $event.stopPropagation();
    this.layoutHandlerService.handleBlockSelect(this.layoutJson.id);
    this.builderInterfaceService.openBodyConfig();
  }

  getCommonStyles(selectorTag: 'div' | 'table'): string {
    // NOTE: Global style rules in email & web layout
    return `<style>
        ${selectorTag}[data-id='${this.layoutJson.id}'] p {margin: 0 !important;padding: 0 !important;}
      </style>`;
  }

}
