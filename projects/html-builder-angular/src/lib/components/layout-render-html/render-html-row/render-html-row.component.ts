import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DndDropEvent } from 'ngx-drag-drop';
import { BaseRowRendererComponent } from '../../../layout-schema/base-components/base-row-renderer/base-row-renderer.component';
import { BaseColumnRendererComponent } from '../../../layout-schema/base-components/base-column-renderer/base-column-renderer.component';
import { BaseContentRendererComponent } from '../../../layout-schema/base-components/base-content-renderer/base-content-renderer.component';
import { BaseEventRendererComponent } from '../../../layout-schema/base-components/base-event-renderer/base-event-renderer.component';
import { LayoutHandlerService } from '../../../services/layout-handler.service';
import { EventRowType } from '../../../types/event-row-type';
import { ContentComponentType } from '../../../enums/content-components.enums';

/**
 * NOTE: Because we are rendering components recursively (row -> column -> content -> event -> row)
 * and that causes circular dependency error during library compile,
 * we need to place circularly dependant components is same file, to avoid compile time error:
 * error NG3003: One or more import cycles would need to be created to compile this component, which is not supported by the current compiler configuration.
 *
 * @See: https://angular.io/errors/NG3003
 */

@Component({
  selector: 'render-html-row',
  templateUrl: './render-html-row.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RenderHtmlRowComponent extends BaseRowRendererComponent {}

@Component({
  selector: 'render-html-column',
  templateUrl: '../render-html-column/render-html-column.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RenderHtmlColumnComponent extends BaseColumnRendererComponent {
}

@Component({
  selector: 'render-html-content',
  templateUrl: '../render-html-content/render-html-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class RenderHtmlContentComponent extends BaseContentRendererComponent { }


@Component({
  selector: 'render-html-event',
  templateUrl: '../render-html-event/render-html-event.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RenderHtmlEventComponent extends BaseEventRendererComponent {

  readonly dropZoneFor = [
    ContentComponentType.BLOCK,
  ];

  constructor(private layoutHandlerService: LayoutHandlerService) {
    super(layoutHandlerService);
  }

  onContentRowsDrop(event: DndDropEvent, rowType: EventRowType): void {
    this.layoutHandlerService.handleEventContentDrop(this.id, rowType, event.type, event.index, event.data, event.dropEffect);
  }

  onRowClick($event: MouseEvent, rowId: string) {
    $event.stopPropagation();
    this.layoutHandlerService.handleBlockSelect(rowId);
  }

}
