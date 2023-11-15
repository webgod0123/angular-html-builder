import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ElementAlignments, ElementAlignmentType, Responsive } from '../../../../enums';
import { ISpacing } from '../../../../layout-schema/layout-schema.interface';

@Component({
  selector: 'event-right-sidebar-config',
  templateUrl: './event-right-sidebar-config.component.html',
  styleUrls: ['./event-right-sidebar-config.component.scss'],
})
export class EventRightSidebarConfigComponent {

  @Input() responsive: Responsive;

  form: FormGroup;
  containerPadding: ISpacing;

  readonly alignmentType = ElementAlignmentType.HORIZONTAL;

  constructor() {
    this.initForm();
  }

  formValue(formControl: string) {
    return this.form.get(formControl)?.value;
  }

  setAlignment(alignment: ElementAlignments) {
    this.form.patchValue({
      textAlign: alignment,
    },);
  }

  setContainerPadding(padding: ISpacing) {
    this.form.patchValue({
      containerPaddingTop: padding.paddingTop,
      containerPaddingLeft: padding.paddingLeft,
      containerPaddingRight: padding.paddingRight,
      containerPaddingBottom: padding.paddingBottom,
    },);
  }

  private initForm() {
    this.form = new FormGroup({
      textColor: new FormControl('rgb(0,0,0)'),
      textAlign: new FormControl(ElementAlignments.HORIZONTAL_LEFT),
      lineHeight: new FormControl(0),
      inheritBodyStyles: new FormControl(true),
      linkColor: new FormControl('rgb(0,0,0)'),
      underline: new FormControl(false),
      containerPaddingTop: new FormControl(10),
      containerPaddingLeft: new FormControl(10),
      containerPaddingRight: new FormControl(10),
      containerPaddingBottom: new FormControl(10),
    });
  }

}
