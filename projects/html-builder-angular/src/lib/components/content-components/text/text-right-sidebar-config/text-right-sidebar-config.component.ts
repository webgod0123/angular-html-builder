import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FONT_FAMILY_LIST, FONT_WEIGHT_LIST } from '../../../../config';
import { ElementAlignments, ElementAlignmentType, Responsive } from '../../../../enums';
import { ISpacing, ITextValue } from '../../../../layout-schema/layout-schema.interface';
import { LayoutHandlerService } from '../../../../services/layout-handler.service';
import { TextHandlerService } from '../../../../services/text-handler.service';

@Component({
  selector: 'text-right-sidebar-config',
  templateUrl: './text-right-sidebar-config.component.html',
  styleUrls: ['./text-right-sidebar-config.component.scss'],
})
export class TextRightSideBarConfigComponent implements OnInit, OnDestroy {

  readonly fonts = FONT_FAMILY_LIST;
  readonly weights = FONT_WEIGHT_LIST;

  @Input() responsive: Responsive;
  form: FormGroup;
  alignmentType = ElementAlignmentType.HORIZONTAL;
  containerPadding: ISpacing;

  private readonly ngOnDestroySubject = new Subject();

  constructor(private layoutHandlerService: LayoutHandlerService, private textHandlerService: TextHandlerService) {
    this.initForm();
  }

  private initForm() {
    this.form = new FormGroup({
      fontFamily: new FormControl('Arial'),
      fontWeight: new FormControl('Regular'),
      fontSize: new FormControl(0),
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

  private subscribeForValues() {
    this.textHandlerService
      .activeValues$
      .pipe(takeUntil(this.ngOnDestroySubject.asObservable()))
      .subscribe(newValues => {
        this.populateFormWithValues(newValues);
      });
  }

  private populateFormWithValues(newValues: ITextValue | null) {
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

        this.layoutHandlerService.updateTextBlockValues(newValues);
      });
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

}
