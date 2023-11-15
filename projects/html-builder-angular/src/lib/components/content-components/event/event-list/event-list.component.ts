import { Component } from '@angular/core';
import { ContentComponentType } from '../../../../enums';
import { EventColumnType } from '../../../../enums/event-type.enum';

@Component({
  selector: 'event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
})
export class EventListComponent {

  readonly ContentComponentType = ContentComponentType;

  eventColumnTypes: EventColumnType[] = [
    EventColumnType.Type1,
    EventColumnType.Type2,
    EventColumnType.Type3,
    EventColumnType.Type4,
  ];

}
