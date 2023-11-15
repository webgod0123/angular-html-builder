import { Component } from '@angular/core';
import { LayoutHandlerService } from '../../../services/layout-handler.service';
import { IEventValue } from '../../layout-schema.interface';
import { BaseRendererComponent } from '../base-renderer.component';
import { EventColumnType } from '../../../enums/event-type.enum';

enum EventContentTags {
  START = '{{ range $i, $e := .events }}',
  END = '{{ end }}'
}

enum TicketContentTags {
  START = '{{ range $it, $t := .tickets }}',
  END = '{{ end }}'
}

@Component({
  template: '',
})
export abstract class BaseEventRendererComponent extends BaseRendererComponent<IEventValue> {

  readonly FlexDirectionMap = {
    [EventColumnType.Type1]: 'column',
    [EventColumnType.Type2]: 'column-reverse',
    [EventColumnType.Type3]: 'row',
    [EventColumnType.Type4]: 'row-reverse',
  };

  EventContentTags = EventContentTags;
  TicketContentTags = TicketContentTags;

  constructor(layoutHandlerService: LayoutHandlerService) {
    super(layoutHandlerService);
  }

}
