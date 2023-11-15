import { Component, Input } from '@angular/core';
import { DisplayCondition, EventType } from '../../../enums/event-type.enum';
import { eventTypeConditions } from '../../../utils/event-type-conditions';

@Component({
  template: '',
})

export abstract class BaseDisplayConditionsRendererComponent {

  readonly DisplayCondition = DisplayCondition;

  @Input() set displayConditions(displayConditions: EventType[] | null | undefined) {
    if (!Array.isArray(displayConditions)) {
      return;
    }

    this.displayCondition = this.constructDisplayCondition(displayConditions);
  }

  displayCondition?: string;

  private constructDisplayCondition(displayConditions: EventType[]): string {
    if (displayConditions.length === 1) {
      return `${DisplayCondition.IfStart}${eventTypeConditions[displayConditions[0]]}${DisplayCondition.IfEnd}`;
    } else {
      let displayCondition = `${DisplayCondition.IfStart}${DisplayCondition.OrStart}`;

      displayConditions.forEach((displayItem, index) => {
        displayCondition += DisplayCondition.OrInnerStart + eventTypeConditions[displayItem] + DisplayCondition.OrEnd;

        if (index < displayConditions.length - 1) {
          displayCondition += ' ';
        }
      });

      displayCondition += DisplayCondition.IfEnd;

      return displayCondition;
    }
  }

}
