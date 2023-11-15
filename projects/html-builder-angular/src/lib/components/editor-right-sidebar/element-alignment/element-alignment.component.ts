import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ElementAlignments, ElementAlignmentType } from '../../../enums/element-alignment.enums';

@Component({
  selector: 'element-alignment',
  templateUrl: './element-alignment.component.html',
})

export class ElementAlignmentComponent implements OnChanges {

  @Input() type: ElementAlignmentType;
  @Input() activeAlignment: ElementAlignments;
  @Output() setAlignment = new EventEmitter();

  activeElementAlignment: ElementAlignments;
  elementAlignments = [
    { icon: 'format_align_left', alignment: ElementAlignments.HORIZONTAL_LEFT, type: ElementAlignmentType.HORIZONTAL },
    { icon: 'format_align_center', alignment: ElementAlignments.HORIZONTAL_CENTER, type: ElementAlignmentType.HORIZONTAL },
    { icon: 'format_align_right', alignment: ElementAlignments.HORIZONTAL_RIGHT, type: ElementAlignmentType.HORIZONTAL },
    { icon: 'format_align_justify', alignment: ElementAlignments.HORIZONTAL_JUSTIFY, type: ElementAlignmentType.HORIZONTAL },
    { icon: 'align_vertical_top', alignment: ElementAlignments.VERTICAL_TOP, type: ElementAlignmentType.VERTICAL },
    { icon: 'align_vertical_center', alignment: ElementAlignments.VERTICAL_CENTER, type: ElementAlignmentType.VERTICAL },
    { icon: 'align_vertical_bottom', alignment: ElementAlignments.VERTICAL_BOTTOM, type: ElementAlignmentType.VERTICAL },
  ];

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.activeAlignment) {
      return;
    }

    const alignment = changes.activeAlignment.currentValue;

    this.activeElementAlignment = alignment;
  }

  align(alignment: ElementAlignments) {
    this.activeElementAlignment = alignment;
    this.setAlignment.emit(alignment);
  }

  elements(type: ElementAlignmentType) {
    if (type === ElementAlignmentType.CONTENT) {
      return [this.elementAlignments[0], this.elementAlignments[1]];
    } else {
      return this.elementAlignments.filter(element => element.type === type);
    }
  }

  isHorizontal() {
    return this.type === ElementAlignmentType.HORIZONTAL;
  }

  isVertical() {
    return this.type === ElementAlignmentType.VERTICAL;
  }

  isContent() {
    return this.type === ElementAlignmentType.CONTENT;
  }

}
