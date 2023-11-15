import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@interticket/core';
import { DndDropEvent } from 'ngx-drag-drop';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FONT_FAMILY_LIST, FONT_WEIGHT_LIST } from '../../../../config';
import { ElementAlignments, ElementAlignmentType, SiteAction } from '../../../../enums';
import { ISelectOption } from '../../../../interfaces/select-option.interface';
import { IMenuItem, IMenuValue, ISpacing } from '../../../../layout-schema/layout-schema.interface';
import { InitialValuesService } from '../../../../services/initial-values.service';
import { LayoutHandlerService } from '../../../../services/layout-handler.service';
import { MenuHandlerService } from '../../../../services/menu-handler-service.service';
import { uuidv4 } from '../../../../utils/uuid';

type MenuItem = 'menu-item';

@Component({
  selector: 'menu-right-sidebar-config',
  templateUrl: './menu-right-sidebar-config.component.html',
  styleUrls: ['./menu-right-sidebar-config.component.scss'],
})

export class MenuRightSidebarConfigComponent implements OnInit, OnDestroy {

  alignmentType = ElementAlignmentType;
  SiteAction = SiteAction;
  form: FormGroup;
  padding: ISpacing;
  containerPadding: ISpacing;
  fonts = FONT_FAMILY_LIST;
  weights = FONT_WEIGHT_LIST;

  readonly actionList: ISelectOption[] = this.constructActionList();
  readonly targetList: ISelectOption[] = this.constructTargetList();
  readonly MenuItem: MenuItem;
  readonly dropZoneFor: [MenuItem];
  private readonly ngOnDestroySubject = new Subject();

  constructor(
    private translateService: TranslateService,
    private menuHandlerService: MenuHandlerService,
    private layoutHandlerService: LayoutHandlerService,
    private initialService: InitialValuesService,
    private fb: FormBuilder,

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

  onDrop(event: DndDropEvent) {
    const currentIndex = event.data;
    const currentGroup = this.menuItems.at(currentIndex);
    const targetIndex = event.index ?? this.menuItems.length;
    this.menuItems.removeAt(currentIndex);
    this.menuItems.insert(targetIndex, currentGroup);
  }

  private constructTargetList() {
    return [
      { name: this.translateService.get('admin_email_template_new_tab'), key: '_blank' },
      { name: this.translateService.get('admin_email_template_same_tab'), key: '_self' },
    ];
  }

  private constructActionList() {
    return [
      { name: this.translateService.get('admin_email_template_open_website'), key: SiteAction.WEBSITE },
      { name: this.translateService.get('admin_email_template_send_email'), key: SiteAction.EMAIL },
      { name: this.translateService.get('admin_email_template_call_phone_number'), key: SiteAction.PHONE },
    ];
  }

  layouts = [
    { name: 'Horizontal', value: ElementAlignmentType.HORIZONTAL },
    { name: 'Vertical', value: ElementAlignmentType.VERTICAL },
  ];

  get menuItems(): FormArray {
    return this.form.get('menuItems') as FormArray;
  }

  newMenuItem(menuItem?: IMenuItem): FormGroup {
    return this.fb.group({
      id: menuItem ? menuItem.id : uuidv4(),
      text: menuItem ? menuItem.text : 'Menu',
      actionType: menuItem ? menuItem.actionType : SiteAction.WEBSITE,
      href: menuItem ? menuItem.href : '',
      target: menuItem ? menuItem.target : '_self',
      emailTo: menuItem ? menuItem.emailTo : '',
      subject: menuItem ? menuItem.subject : '',
      body: menuItem ? menuItem.body : '',
      phone: menuItem ? menuItem.phone : '',
    });
  }

  addMenuItem() {
    this.menuItems.push(this.newMenuItem());
  }

  removeMenuItem(i: number) {
    this.menuItems.removeAt(i);
  }

  formValue(formControl: string) {
    return this.form.get(formControl)?.value;
  }

  setAlignment(alignment: ElementAlignments) {
    this.form.patchValue({
      textAlign: alignment,
    },);
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

  private initForm() {
    this.form = new FormGroup({
      textColor: new FormControl(this.initialService.DEFAULT_TEXT_COLOR),
      linkColor: new FormControl(this.initialService.DEFAULT_LINK_COLOR),
      fontFamily: new FormControl(this.initialService.DEFAULT_FONT_FAMILY),
      fontWeight: new FormControl(this.initialService.DEFAULT_FONT_WEIGHT),
      fontSize: new FormControl(this.initialService.DEFAULT_FONT_SIZE),
      textAlign: new FormControl(this.initialService.DEFAULT_TEXT_ALIGN),
      layout: new FormControl(this.initialService.DEFAULT_MENU_LAYOUT),
      paddingTop: new FormControl(this.initialService.DEFAULT_PADDING),
      paddingLeft: new FormControl(this.initialService.DEFAULT_PADDING),
      paddingRight: new FormControl(this.initialService.DEFAULT_PADDING),
      paddingBottom: new FormControl(this.initialService.DEFAULT_PADDING),
      containerPaddingTop: new FormControl(this.initialService.DEFAULT_PADDING),
      containerPaddingRight: new FormControl(this.initialService.DEFAULT_PADDING),
      containerPaddingLeft: new FormControl(this.initialService.DEFAULT_PADDING),
      containerPaddingBottom: new FormControl(this.initialService.DEFAULT_PADDING),
      separator: new FormControl(''),
      menuItems: this.fb.array([]),
    });
  }

  private subscribeForValues() {
    this.menuHandlerService
      .activeValues$
      .pipe(takeUntil(this.ngOnDestroySubject.asObservable()))
      .subscribe(newValues => {
        this.populateFormWithValues(newValues);
      });
  }

  private populateFormWithValues(newValues: IMenuValue | null) {
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

    this.menuItems.clear({ emitEvent: false });

    newValues.menuItems.forEach(menuItem => {
      this.menuItems.push(this.newMenuItem(menuItem), { emitEvent: false });
    });

    this.form.patchValue({
      textAlign: newValues.textAlign,
      textColor: newValues.textColor,
      paddingTop: newValues.paddingTop,
      paddingLeft: newValues.paddingLeft,
      paddingRight: newValues.paddingRight,
      paddingBottom: newValues.paddingBottom,
      layout: newValues.layout,
      fontSize: newValues.fontSize,
      linkColor: newValues.linkColor,
      fontWeight: newValues.fontWeight,
      fontFamily: newValues.fontFamily,
      containerPaddingTop: newValues.containerPadding.paddingTop,
      containerPaddingLeft: newValues.containerPadding.paddingLeft,
      containerPaddingRight: newValues.containerPadding.paddingRight,
      containerPaddingBottom: newValues.containerPadding.paddingBottom,
      separator: newValues.separator,
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

        this.layoutHandlerService.updateMenuValues(newValues);
      });
  }

}
