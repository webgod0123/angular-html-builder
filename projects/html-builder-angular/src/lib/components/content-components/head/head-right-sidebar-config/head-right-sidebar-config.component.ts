import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IHeadValue, ISpacing } from '../../../../layout-schema/layout-schema.interface';
import { HeadingType, HeadingTypeFontSize } from '../../../../enums/heading-type.enums';
import { FONT_FAMILY_LIST, FONT_WEIGHT_LIST } from '../../../../config';
import { ElementAlignments, ElementAlignmentType, Responsive } from '../../../../enums';
import { HeadHandlerService } from '../../../../services/head-handler.service';
import { LayoutHandlerService } from '../../../../services/layout-handler.service';

@Component({
  selector: 'head-right-sidebar-config',
  templateUrl: './head-right-sidebar-config.component.html',
  styleUrls: ['./head-right-sidebar-config.component.scss'],
})
export class HeadRightSideBarConfigComponent implements OnInit, OnDestroy {

  readonly fonts = FONT_FAMILY_LIST;
  readonly weights = FONT_WEIGHT_LIST;

  @Input() responsive: Responsive;
  form: FormGroup;
  alignmentType = ElementAlignmentType.HORIZONTAL;
  containerPadding: ISpacing;

  private readonly ngOnDestroySubject = new Subject();

  constructor(private layoutHandlerService: LayoutHandlerService, private headHandlerService: HeadHandlerService) {
    this.initForm();
  }

  private initForm() {
    this.form = new FormGroup({
      headingType: new FormControl(HeadingType.H3),
      fontFamily: new FormControl('Arial'),
      fontWeight: new FormControl('Regular'),
      fontSize: new FormControl(HeadingTypeFontSize[HeadingType.H3]),
      textColor: new FormControl('rgb(0,0,0)'),
      lineHeight: new FormControl(0),
      textAlign: new FormControl(ElementAlignments.HORIZONTAL_LEFT),
      inheritBodyStyles: new FormControl(true),
      linkColor: new FormControl('rgb(0,0,0)'),
      underline: new FormControl(true),
      containerPaddingTop: new FormControl(10),
      containerPaddingLeft: new FormControl(10),
      containerPaddingRight: new FormControl(10),
      containerPaddingBottom: new FormControl(10),
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

  setHeadingType(type: HeadingType) {
    this.form.patchValue({
      headingType: type,
      fontSize: HeadingTypeFontSize[type],
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

  setAlignment(alignment: ElementAlignments) {
    this.form.patchValue({
      textAlign: alignment,
    },);
  }

  isDesktop() {
    return this.responsive === Responsive.DESKTOP;
  }

  isMobile() {
    return this.responsive === Responsive.MOBILE;
  }

  private subscribeForValues() {
    this.headHandlerService
      .activeValues$
      .pipe(takeUntil(this.ngOnDestroySubject.asObservable()))
      .subscribe(newValues => {
        this.populateFormWithValues(newValues);
      });
  }

  private populateFormWithValues(newValues: IHeadValue | null) {
    if (!newValues) {
      return;
    }

    this.containerPadding = {
      paddingTop: newValues.containerPadding.paddingTop,
      paddingLeft: newValues.containerPadding.paddingLeft,
      paddingRight: newValues.containerPadding.paddingRight,
      paddingBottom: newValues.containerPadding.paddingBottom,
    };

    this.form.patchValue({
      headingType: newValues.headingType,
      fontFamily: newValues.fontFamily,
      fontWeight: newValues.fontWeight,
      fontSize: newValues.fontSize,
      textColor: newValues.textColor,
      textAlign: newValues.textAlign,
      lineHeight: newValues.lineHeight,
      inheritBodyStyles: newValues.inheritBodyStyles,
      linkColor: newValues.linkColor,
      underline: newValues.underline,
      containerPaddingTop: newValues.containerPadding.paddingTop,
      containerPaddingLeft: newValues.containerPadding.paddingLeft,
      containerPaddingRight: newValues.containerPadding.paddingRight,
      containerPaddingBottom: newValues.containerPadding.paddingBottom,
    }, { emitEvent: false });
  }

  private subscribeFormChanges() {
    this.form
      .valueChanges
      .pipe(takeUntil(this.ngOnDestroySubject.asObservable()))
      .subscribe(newValues => {
        newValues.containerPadding = {
          paddingTop: newValues.containerPaddingTop,
          paddingLeft: newValues.containerPaddingLeft,
          paddingRight: newValues.containerPaddingRight,
          paddingBottom: newValues.containerPaddingBottom,
        };

        this.layoutHandlerService.updateHeadBlockValues(newValues);
      });
  }

}
