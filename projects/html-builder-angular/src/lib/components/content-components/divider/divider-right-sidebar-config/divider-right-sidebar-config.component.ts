import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ElementAlignments, ElementAlignmentType, Responsive } from '../../../../enums';
import { IBorder, IDividerValues, ISpacing } from '../../../../layout-schema/layout-schema.interface';
import { DividerHandlerService } from '../../../../services/divider-handler.service';
import { LayoutHandlerService } from '../../../../services/layout-handler.service';

@Component({
  selector: 'divider-right-sidebar-config',
  templateUrl: './divider-right-sidebar-config.component.html',
  styleUrls: ['./divider-right-sidebar-config.component.scss'],
})
export class DividerRightSideBarConfigComponent implements OnInit, OnDestroy {

  @Input() responsive: Responsive;
  form: FormGroup;
  alignmentType = ElementAlignmentType.HORIZONTAL;
  border: IBorder;
  padding: ISpacing;

  private readonly ngOnDestroySubject = new Subject();

  constructor(
    private layoutHandlerService: LayoutHandlerService,
    private dividerHandlerService: DividerHandlerService
  ) {
    this.initForm();
  }

  private initForm() {
    this.form = new FormGroup({
      width: new FormControl(100),
      borderTopStyle: new FormControl('solid'),
      borderTopWidth: new FormControl('0'),
      borderTopColor: new FormControl('rgb(0,0,0)'),
      paddingTop: new FormControl(10),
      paddingLeft: new FormControl(10),
      paddingRight: new FormControl(10),
      paddingBottom: new FormControl(10),
      textAlign: new FormControl(ElementAlignments.HORIZONTAL_CENTER),
    });
  }

  ngOnInit(): void {
    this.subscribeForValues();
    this.subscribeFormChanges();
  }

  ngOnDestroy(): void {
    this.ngOnDestroySubject.next(true);
  }

  formValue(formControl: string) {
    return this.form.get(formControl)?.value;
  }

  setBorder(border: IBorder) {
    this.form.patchValue({
      borderTopStyle: border.borderTopStyle,
      borderTopColor: border.borderTopColor,
      borderTopWidth: border.borderTopWidth,
    });
  }

  setPadding(padding: ISpacing) {
    this.form.patchValue({
      paddingTop: padding.paddingTop,
      paddingLeft: padding.paddingLeft,
      paddingRight: padding.paddingRight,
      paddingBottom: padding.paddingBottom,
    },);
  }

  setAlignment(alignment: ElementAlignments) {
    this.form.patchValue({
      textAlign: alignment,
    },);
  }

  private subscribeForValues() {
    this.dividerHandlerService
      .activeValues$
      .pipe(takeUntil(this.ngOnDestroySubject.asObservable()))
      .subscribe(newValues => {
        this.populateFormWithValues(newValues);
      });
  }


  private populateFormWithValues(newValues: IDividerValues | null) {
    if (!newValues) {
      return;
    }

    this.border = {
      borderTopColor: newValues.borderTopColor || 'rgb(0,0,0)',
      borderTopWidth: newValues.borderTopWidth || 0,
      borderTopStyle: newValues.borderTopStyle || 'solid',
    };

    this.padding = {
      paddingTop: newValues.paddingTop,
      paddingLeft: newValues.paddingLeft,
      paddingRight: newValues.paddingRight,
      paddingBottom: newValues.paddingBottom,
    };

    this.form.patchValue({
      textAlign: newValues.textAlign,
      paddingTop: newValues.paddingTop,
      paddingLeft: newValues.paddingLeft,
      paddingRight: newValues.paddingRight,
      paddingBottom: newValues.paddingBottom,
      width: newValues.width,
      borderTopColor: newValues.borderTopColor,
      borderTopWidth: newValues.borderTopWidth,
      borderTopStyle: newValues.borderTopStyle,
    }, { emitEvent: false });
  }

  private subscribeFormChanges() {
    this.form
      .valueChanges
      .pipe(takeUntil(this.ngOnDestroySubject.asObservable()))
      .subscribe(newValues => {
        this.layoutHandlerService.updateDividerValues(newValues);
      });
  }

  isDesktop() {
    return this.responsive === Responsive.DESKTOP;
  }

  isMobile() {
    return this.responsive === Responsive.MOBILE;
  }

}
