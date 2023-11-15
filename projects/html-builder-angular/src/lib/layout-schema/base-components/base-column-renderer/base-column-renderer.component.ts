import { Component, Input } from '@angular/core';
import { DndDropEvent } from 'ngx-drag-drop';
import { ContentComponentType } from '../../../enums';
import { LayoutHandlerService } from '../../../services/layout-handler.service';
import { IColumn } from '../../layout-schema.interface';

@Component({
  template: '',
})
export abstract class BaseColumnRendererComponent {

  @Input() layoutJson: IColumn;

  readonly dropZoneFor = [
    ContentComponentType.TEXT,
    ContentComponentType.VARIABLE,
    ContentComponentType.IMAGE,
    ContentComponentType.BUTTON,
    ContentComponentType.MENU,
    ContentComponentType.HTML,
    ContentComponentType.DIVIDER,
    ContentComponentType.HEAD,
  ];

  constructor(private _layoutHandlerService: LayoutHandlerService) { }

  onDrop(column: IColumn, event: DndDropEvent) {
    this._layoutHandlerService.addContentToColumn(column, event.type, event.index, event.data, event.dropEffect);
  }

}
