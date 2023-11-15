import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { BACKGROUND_IMAGE_REPEAT_LIST } from '../../../config';
import { BackgroundRepeat } from '../../../layout-schema/layout-schema.interface';

@Component({
  selector: 'background-image-repeat-form',
  templateUrl: './background-image-repeat-form.component.html',
})

export class BackgroundImageRepeatFormComponent implements OnChanges {

  readonly backgroundImageRepeatList = BACKGROUND_IMAGE_REPEAT_LIST;

  @Input() backgroundRepeat = '';
  @Output() backgroundImageRepeat = new EventEmitter<BackgroundRepeat>();

  activeBackgroundRepeat = '';

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.backgroundRepeat) {
      return;
    }

    this.activeBackgroundRepeat = changes.backgroundRepeat.currentValue;
  }

  setBackgroundImageRepeat(value: BackgroundRepeat) {
    this.activeBackgroundRepeat = value;
    this.backgroundImageRepeat.emit(value);
  }

}
