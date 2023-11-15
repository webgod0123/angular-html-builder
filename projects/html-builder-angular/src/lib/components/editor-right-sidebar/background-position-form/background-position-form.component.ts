import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { BackgroundPosition } from '../../../enums/background-position.enum';

@Component({
  selector: 'background-position-form',
  templateUrl: './background-position-form.component.html',
  styleUrls: ['./background-position-form.component.scss'],
})

export class BackgroundPositionFormComponent implements OnChanges {

  @Input() initPosition: BackgroundPosition;
  @Output() setBackgroundPosition = new EventEmitter<BackgroundPosition>();

  position: BackgroundPosition;
  readonly BackgroundPosition = BackgroundPosition;

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.initPosition) {
      return;
    }

    this.position = changes.initPosition.currentValue;
  }


  setPosition(position: BackgroundPosition) {
    this.position = position;
    this.setBackgroundPosition.emit(position);
  }

  selected(position: BackgroundPosition) {
    return position === this.position;
  }

}
