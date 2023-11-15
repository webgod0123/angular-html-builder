import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { HeadingType } from '../../../enums/heading-type.enums';

@Component({
  selector: 'heading-type',
  templateUrl: './heading-type.component.html',
})

export class HeadingTypeComponent implements OnChanges {

  @Input() activeType: HeadingType;
  @Output() setHeadingType = new EventEmitter();

  activeHeadingType: HeadingType;
  headingTypes = [
    { icon: 'heading1', type: HeadingType.H1 },
    { icon: 'heading2', type: HeadingType.H2 },
    { icon: 'heading3', type: HeadingType.H3 },
    { icon: 'heading4', type: HeadingType.H4 },
  ];

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.activeType) {
      return;
    }

    const type = changes.activeType.currentValue;

    this.activeHeadingType = type;
  }

  select(type: HeadingType) {
    this.activeHeadingType = type;
    this.setHeadingType.emit(type);
  }

}
