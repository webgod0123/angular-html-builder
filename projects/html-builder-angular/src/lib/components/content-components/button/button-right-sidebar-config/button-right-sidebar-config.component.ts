import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@interticket/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ElementAlignments, ElementAlignmentType, Responsive } from '../../../../enums';
import { SiteAction } from '../../../../enums/site-action.enum';
import { IEventVariable } from '../../../../interfaces/event-variable.interface';
import { IHTMLBuilderService } from '../../../../interfaces/html-builder-service.interface';
import { ISelectOption } from '../../../../interfaces/select-option.interface';
import { IBorder, IBorderRadius, IButtonValue, ISpacing } from '../../../../layout-schema/layout-schema.interface';
import { HTML_BUILDER_SERVICE } from '../../../../providers/email-template-editor-service.provider';
import { ButtonHandlerService } from '../../../../services/button-handler.service';
import { LayoutHandlerService } from '../../../../services/layout-handler.service';

@Component({
  selector: 'button-right-sidebar-config',
  templateUrl: './button-right-sidebar-config.component.html',
  styleUrls: ['./button-right-sidebar-config.component.scss'],
})
export class ButtonRightSideBarConfigComponent implements OnInit, OnDestroy {

  @Input() responsive: Responsive;

  readonly SiteAction = SiteAction;
  readonly actionList: ISelectOption[] = this.constructActionList();
  readonly targetList: ISelectOption[] = this.constructTargetList();

  form: FormGroup;
  alignmentType = ElementAlignmentType.HORIZONTAL;
  padding: ISpacing;
  containerPadding: ISpacing;
  borderRadius: IBorderRadius;
  border: IBorder;
  variableList$: Observable<IEventVariable[]> = this.htmlBuilderService.getEventVariables();

  private readonly ngOnDestroySubject = new Subject();

  constructor(
    private readonly translateService: TranslateService,
    private layoutHandlerService: LayoutHandlerService,
    private buttonHandlerService: ButtonHandlerService,
    @Inject(HTML_BUILDER_SERVICE) private readonly htmlBuilderService: IHTMLBuilderService,
  ) {
    this.initForm();

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

  setPadding(padding: ISpacing) {
    this.form.patchValue({
      paddingTop: padding.paddingTop,
      paddingLeft: padding.paddingLeft,
      paddingRight: padding.paddingRight,
      paddingBottom: padding.paddingBottom,
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

  setBorderRadius(borderRadius: IBorderRadius) {
    this.form.patchValue({
      borderTopLeftRadius: borderRadius.topLeft,
      borderTopRightRadius: borderRadius.topRight,
      borderBottomLeftRadius: borderRadius.bottomLeft,
      borderBottomRightRadius: borderRadius.bottomRight,
    },);
  }

  setBorder(border: IBorder) {
    this.form.patchValue({
      borderTopStyle: border.borderTopStyle,
      borderTopColor: border.borderTopColor,
      borderTopWidth: border.borderTopWidth,
      borderLeftStyle: border.borderLeftStyle,
      borderLeftColor: border.borderLeftColor,
      borderLeftWidth: border.borderLeftWidth,
      borderRightStyle: border.borderRightStyle,
      borderRightColor: border.borderRightColor,
      borderRightWidth: border.borderRightWidth,
      borderBottomStyle: border.borderBottomStyle,
      borderBottomColor: border.borderBottomColor,
      borderBottomWidth: border.borderBottomWidth,
      borderAll: border.borderAll,
    });
  }

  private constructTargetList() {
    return [
      { name: this.translateService.get('admin_email_template_new_tab'), key: '_blank' },
      { name: this.translateService.get('admin_email_template_same_tab'), key: '' },
    ];
  }

  private constructActionList() {
    return [
      { name: this.translateService.get('admin_email_template_open_website'), key: SiteAction.WEBSITE },
      { name: this.translateService.get('admin_email_template_open_url_from_variable'), key: SiteAction.VARIABLE },
      { name: this.translateService.get('admin_email_template_send_email'), key: SiteAction.EMAIL },
      { name: this.translateService.get('admin_email_template_call_phone_number'), key: SiteAction.PHONE },
    ];
  }

  fonts = [
    { name: 'Arial', value: 'Arial' },
    { name: 'Roboto', value: 'Roboto' },
  ];

  weights = [
    { name: 'Regular', value: 'Regular' },
    { name: 'Bold', value: 'Bold' },
  ];

  private initForm() {
    this.form = new FormGroup({
      action: new FormControl(SiteAction.WEBSITE),
      href: new FormControl(''),
      target: new FormControl('_blank'),
      emailTo: new FormControl(''),
      subject: new FormControl(''),
      body: new FormControl(''),
      phone: new FormControl(''),
      variable: new FormControl(''),
      textColor: new FormControl('rgb(255,255,255)'),
      backgroundColor: new FormControl('rgb(58, 174, 224)'),
      autoWidth: new FormControl(true),
      width: new FormControl(100),
      fontFamily: new FormControl('Arial'),
      fontWeight: new FormControl('Regular'),
      fontSize: new FormControl(14),
      lineHeight: new FormControl(0),
      textAlign: new FormControl(ElementAlignments.HORIZONTAL_LEFT),
      paddingTop: new FormControl(10),
      paddingLeft: new FormControl(10),
      paddingRight: new FormControl(10),
      paddingBottom: new FormControl(10),
      borderTopLeftRadius: new FormControl(10),
      borderTopRightRadius: new FormControl(10),
      borderBottomLeftRadius: new FormControl(10),
      borderBottomRightRadius: new FormControl(10),
      containerPaddingTop: new FormControl(10),
      containerPaddingRight: new FormControl(10),
      containerPaddingLeft: new FormControl(10),
      containerPaddingBottom: new FormControl(10),
      borderTopStyle: new FormControl('solid'),
      borderTopWidth: new FormControl('0'),
      borderTopColor: new FormControl('rgb(0,0,0)'),
      borderLeftStyle: new FormControl('solid'),
      borderLeftWidth: new FormControl('0'),
      borderLeftColor: new FormControl('rgb(0,0,0)'),
      borderRightStyle: new FormControl('solid'),
      borderRightWidth: new FormControl('0'),
      borderRightColor: new FormControl('rgb(0,0,0)'),
      borderBottomStyle: new FormControl('solid'),
      borderBottomWidth: new FormControl('0'),
      borderBottomColor: new FormControl('rgb(0,0,0)'),
      borderAll: new FormControl(false),
    });
  }

  private subscribeForValues() {
    this.buttonHandlerService
      .activeValues$
      .pipe(takeUntil(this.ngOnDestroySubject.asObservable()))
      .subscribe(newValues => {
        this.populateFormWithValues(newValues);
      });
  }

  private populateFormWithValues(newValues: IButtonValue | null) {
    if (!newValues) {
      return;
    }

    this.padding = {
      paddingTop: newValues.paddingTop,
      paddingLeft: newValues.paddingLeft,
      paddingRight: newValues.paddingRight,
      paddingBottom: newValues.paddingBottom,
    };

    this.containerPadding = {
      paddingTop: newValues.containerPadding.paddingTop,
      paddingLeft: newValues.containerPadding.paddingLeft,
      paddingRight: newValues.containerPadding.paddingRight,
      paddingBottom: newValues.containerPadding.paddingBottom,
    };

    this.borderRadius = {
      topLeft: newValues.borderTopLeftRadius,
      topRight: newValues.borderTopRightRadius,
      bottomLeft: newValues.borderBottomLeftRadius,
      bottomRight: newValues.borderBottomRightRadius,
    };

    this.border = {
      borderTopColor: newValues.borderTopColor || 'rgb(0,0,0)',
      borderLeftColor: newValues.borderLeftColor || 'rgb(0,0,0)',
      borderRightColor: newValues.borderRightColor || 'rgb(0,0,0)',
      borderBottomColor: newValues.borderBottomColor || 'rgb(0,0,0)',
      borderTopWidth: newValues.borderTopWidth || 0,
      borderLeftWidth: newValues.borderLeftWidth || 0,
      borderRightWidth: newValues.borderRightWidth || 0,
      borderBottomWidth: newValues.borderBottomWidth || 0,
      borderTopStyle: newValues.borderTopStyle || 'solid',
      borderLeftStyle: newValues.borderLeftStyle || 'solid',
      borderRightStyle: newValues.borderRightStyle || 'solid',
      borderBottomStyle: newValues.borderBottomStyle || 'solid',
      borderAll: newValues.borderAll,
    };

    this.form.patchValue({
      autoWidth: newValues.autoWidth,
      textAlign: newValues.textAlign,
      textColor: newValues.textColor,
      paddingTop: newValues.paddingTop,
      paddingLeft: newValues.paddingLeft,
      paddingRight: newValues.paddingRight,
      paddingBottom: newValues.paddingBottom,
      width: newValues.width,
      action: newValues.action,
      href: newValues.href || '',
      target: newValues.target,
      emailTo: newValues.emailTo || '',
      subject: newValues.subject || '',
      body: newValues.body || '',
      phone: newValues.phone || '',
      variable: newValues.variable,
      fontSize: newValues.fontSize,
      backgroundColor: newValues.backgroundColor,
      fontWeight: newValues.fontWeight,
      fontFamily: newValues.fontFamily,
      lineHeight: newValues.lineHeight,
      borderTopColor: newValues.borderTopColor,
      borderLeftColor: newValues.borderLeftColor,
      borderRightColor: newValues.borderRightColor,
      borderBottomColor: newValues.borderBottomColor,
      borderTopWidth: newValues.borderTopWidth,
      borderLeftWidth: newValues.borderLeftWidth,
      borderRightWidth: newValues.borderRightWidth,
      borderBottomWidth: newValues.borderBottomWidth,
      borderTopStyle: newValues.borderTopStyle,
      borderLeftStyle: newValues.borderLeftStyle,
      borderRightStyle: newValues.borderRightStyle,
      borderBottomStyle: newValues.borderBottomStyle,
      borderTopLeftRadius: newValues.borderTopLeftRadius,
      borderTopRightRadius: newValues.borderTopRightRadius,
      borderBottomLeftRadius: newValues.borderBottomLeftRadius,
      borderBottomRightRadius: newValues.borderBottomRightRadius,
      containerPaddingTop: newValues.containerPadding.paddingTop,
      containerPaddingLeft: newValues.containerPadding.paddingLeft,
      containerPaddingRight: newValues.containerPadding.paddingRight,
      containerPaddingBottom: newValues.containerPadding.paddingBottom,
      borderAll: newValues.borderAll,
    }, { emitEvent: false });
  }

  private subscribeFormChanges() {
    this.form
      .valueChanges
      .pipe(takeUntil(this.ngOnDestroySubject.asObservable()))
      .subscribe(newValues => {
        if (newValues.action !== SiteAction.WEBSITE && newValues.action !== SiteAction.VARIABLE) {
          newValues.target = '';
        }

        if (newValues.action !== SiteAction.VARIABLE) {
          newValues.variable = '';
        }

        newValues.containerPadding = {
          paddingTop: newValues.containerPaddingTop,
          paddingLeft: newValues.containerPaddingLeft,
          paddingRight: newValues.containerPaddingRight,
          paddingBottom: newValues.containerPaddingBottom,
        };

        this.layoutHandlerService.updateButtonValues(newValues);
      });
  }


  isDesktop() {
    return this.responsive === Responsive.DESKTOP;
  }

  isMobile() {
    return this.responsive === Responsive.MOBILE;
  }

}
