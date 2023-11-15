import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Responsive } from '../../../../enums';
import { IHtmlValue, ISpacing } from '../../../../layout-schema/layout-schema.interface';
import { LayoutHandlerService } from '../../../../services/layout-handler.service';
import { HtmlHandlerService } from '../../../../services/html-handler.service';
import { InitialValuesService } from '../../../../services/initial-values.service';

@Component({
  selector: 'html-right-sidebar-config',
  templateUrl: './html-right-sidebar-config.component.html',
  styleUrls: ['./html-right-sidebar-config.component.scss'],
})
export class HtmlRightSideBarConfigComponent implements OnInit, OnDestroy {

  @Input() responsive: Responsive;
  form: FormGroup;
  containerPadding: ISpacing;

  private readonly ngOnDestroySubject = new Subject();

  get htmlControl() {
    return this.form.get('htmlContent');
  }

  constructor(private layoutHandlerService: LayoutHandlerService, private htmlHandlerService: HtmlHandlerService, private initialService: InitialValuesService,) {
    this.initForm();
  }

  setContainerPadding(padding: ISpacing) {
    this.form.patchValue({
      containerPaddingTop: padding.paddingTop,
      containerPaddingLeft: padding.paddingLeft,
      containerPaddingRight: padding.paddingRight,
      containerPaddingBottom: padding.paddingBottom,
    },);
  }

  onChangeEditor(html: string) {
    this.form.patchValue({
      htmlContent: html,
    },);
  }

  private initForm() {
    this.form = new FormGroup({
      htmlContent: new FormControl(''),
      containerPaddingTop: new FormControl(this.initialService.DEFAULT_PADDING),
      containerPaddingRight: new FormControl(this.initialService.DEFAULT_PADDING),
      containerPaddingLeft: new FormControl(this.initialService.DEFAULT_PADDING),
      containerPaddingBottom: new FormControl(this.initialService.DEFAULT_PADDING),
    });
  }

  ngOnInit(): void {
    this.subscribeForValues();
    this.subscribeFormChanges();
  }

  ngOnDestroy(): void {
    this.ngOnDestroySubject.next(true);
  }

  isDesktop() {
    return this.responsive === Responsive.DESKTOP;
  }

  isMobile() {
    return this.responsive === Responsive.MOBILE;
  }

  private subscribeForValues() {
    this.htmlHandlerService
      .activeValues$
      .pipe(takeUntil(this.ngOnDestroySubject.asObservable()))
      .subscribe(newValues => {
        this.populateFormWithValues(newValues);
      });
  }

  private populateFormWithValues(newValues: IHtmlValue | null) {
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
      htmlContent: newValues.htmlContent,
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

        this.layoutHandlerService.updateHtmlValues(newValues);
      });
  }

}
