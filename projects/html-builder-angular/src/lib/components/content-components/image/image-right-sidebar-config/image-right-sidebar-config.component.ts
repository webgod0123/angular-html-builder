import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@interticket/core';
import { EditorConfigService } from '../../../../services/editor-config.service';
import { ElementAlignments, ElementAlignmentType } from '../../../../enums';
import { SiteAction } from '../../../../enums/site-action.enum';
import { ISelectOption } from '../../../../interfaces/select-option.interface';
import { IImageValue, ISpacing } from '../../../../layout-schema/layout-schema.interface';
import { ImageHandlerService } from '../../../../services/image-handler.service';
import { LayoutHandlerService } from '../../../../services/layout-handler.service';

@Component({
  selector: 'image-right-sidebar-config',
  templateUrl: './image-right-sidebar-config.component.html',
  styleUrls: ['./image-right-sidebar-config.component.scss'],
})

export class ImageRightSidebarConfigComponent implements OnInit, OnDestroy {

  readonly SiteAction = SiteAction;
  readonly actionList: ISelectOption[] = this.constructActionList();
  readonly targetList: ISelectOption[] = this.constructTargetList();

  form: FormGroup;
  alignmentType = ElementAlignmentType.HORIZONTAL;
  padding: ISpacing;

  private readonly ngOnDestroySubject = new Subject();

  constructor(
    private imageHandlerService: ImageHandlerService,
    private layoutHandlerService: LayoutHandlerService,
    private translateService: TranslateService,
    private editorConfigService: EditorConfigService
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
    });
  }

  setAlignment(alignment: ElementAlignments) {
    this.form.patchValue({
      textAlign: alignment,
    });
  }

  onClickFileUpload() {
    const element: HTMLElement = document.getElementById('image_upload') as HTMLElement;
    const fileInput = element.querySelector('input[type=file]') as HTMLElement;
    fileInput.click();
  }

  uploadImageFile(url: string) {
    this.form.patchValue({
      src: this.editorConfigService.getImagePath(url),
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
      { name: this.translateService.get('admin_email_template_send_email'), key: SiteAction.EMAIL },
      { name: this.translateService.get('admin_email_template_call_phone_number'), key: SiteAction.PHONE },
    ];
  }

  private initForm() {
    this.form = new FormGroup({
      src: new FormControl(''),
      autoWidth: new FormControl(true),
      textAlign: new FormControl(ElementAlignments.HORIZONTAL_LEFT),
      altText: new FormControl(''),
      paddingTop: new FormControl(0),
      paddingLeft: new FormControl(0),
      paddingRight: new FormControl(0),
      paddingBottom: new FormControl(0),
      width: new FormControl(100),
      action: new FormControl(SiteAction.WEBSITE),
      href: new FormControl(''),
      target: new FormControl('_blank'),
      emailTo: new FormControl(''),
      subject: new FormControl(''),
      body: new FormControl(''),
      phone: new FormControl(''),
    });
  }

  private subscribeForValues() {
    this.imageHandlerService.activeValues$
      .pipe(takeUntil(this.ngOnDestroySubject.asObservable()))
      .subscribe(newValues => {
        this.populateFormWithValues(newValues);
      });
  }

  private populateFormWithValues(newValues: IImageValue | null) {
    if (!newValues) {
      return;
    }

    this.padding = {
      paddingTop: newValues.paddingTop,
      paddingLeft: newValues.paddingLeft,
      paddingRight: newValues.paddingRight,
      paddingBottom: newValues.paddingBottom,
    };

    this.form.patchValue(
      {
        src: newValues.src,
        autoWidth: newValues.autoWidth,
        textAlign: newValues.textAlign,
        altText: newValues.altText,
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
      },
      { emitEvent: false }
    );
  }

  private subscribeFormChanges() {
    this.form.valueChanges.pipe(takeUntil(this.ngOnDestroySubject.asObservable())).subscribe(newValues => {
      if (newValues.autoWidth) {
        newValues.width = 100;
      }
      if (newValues.action !== SiteAction.WEBSITE) {
        newValues.target = '';
      }
      this.layoutHandlerService.updateImageValues(newValues);
    });
  }

}
