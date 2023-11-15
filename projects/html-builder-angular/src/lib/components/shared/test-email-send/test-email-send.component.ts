import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AAGUID, LanguageCode, TranslateService } from '@interticket/core';
import { Observable } from 'rxjs';
import { IDisplayCondition, ITestEmailSend } from '../../../interfaces/display-condition';
import { LayoutHandlerService } from '../../../services/layout-handler.service';

interface IPreviewSettingsDialogData {
  title: string;
  createTitle: string;
  displayConditions: string[];
  onTestSend?: (templateId: AAGUID, data: ITestEmailSend) => Observable<Response>
}

interface ILanguage {
  value: string;
  label: string;
}

@Component({
  selector: 'test-email-send',
  templateUrl: './test-email-send.component.html',
  styleUrls: ['./test-email-send.component.scss'],
})

export class TestEmailSendComponent implements OnInit {

  readonly supportedLangs = this.translateService.supportedLangs;

  languages: ILanguage[] = this.getLanguages();
  form: UntypedFormGroup;
  eventsLabel = 'EventCount';
  ticketsLabel = 'TicketCount';

  constructor(
    private readonly dialogRef: MatDialogRef<TestEmailSendComponent>,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly layoutHandlerService: LayoutHandlerService,
    private readonly translateService: TranslateService,
    @Inject(MAT_DIALOG_DATA) public readonly data: IPreviewSettingsDialogData,
  ) { }

  ngOnInit(): void {
    this.createForms(this.data.displayConditions);
  }

  getLanguages() {
    return this.supportedLangs.map((lang) => ({
      value: lang,
      label: this.translateService.get(`lang_label_${lang}`),
    }));
  }

  onEnableEvent(label: string) {
    const checked = this.form.get(label)?.value;
    if (checked) {
      this.form.get(this.getEventsCountLabel(label))?.enable();
      this.form.get(this.getTicketsCountLabel(label))?.enable();
    } else {
      this.form.get(this.getEventsCountLabel(label))?.disable();
      this.form.get(this.getTicketsCountLabel(label))?.disable();
    }
  }

  getEventsCountLabel(label: string) {
    return `${label}${this.eventsLabel}`;
  }

  getTicketsCountLabel(label: string) {
    return `${label}${this.ticketsLabel}`;
  }

  hasError(label: string, error: string): boolean {
    return !!this.formError(label, error);
  }

  formError(label: string, error: string): string {
    const errors = this.form.controls[label].errors;
    if (!errors) {
      return '';
    }
    return errors[error] && errors[error][error];
  }

  private createForms(displayConditions: string[]): void {
    const conditionForms = {};

    displayConditions.forEach(displayCondition => {
      conditionForms[displayCondition] = [{ value: false, disabled: false }];
      conditionForms[this.getEventsCountLabel(displayCondition)] = [{ value: '', disabled: true }, Validators.max(3)];
      conditionForms[this.getTicketsCountLabel(displayCondition)] = [{ value: '', disabled: true }, Validators.max(3)];
    });

    this.form = this.formBuilder.group({
      ...conditionForms,
      language: [{ value: this.languages.find(language => language.value === LanguageCode.EN), disabled: false }],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    const displayConditions: IDisplayCondition[] = this.data.displayConditions.map(displayCondition => {
      const eventCount = this.form.get(this.getEventsCountLabel(displayCondition))?.value;
      const ticketCount = this.form.get(this.getTicketsCountLabel(displayCondition))?.value;

      return {
        name: displayCondition,
        event_count: eventCount ? eventCount : 0,
        ticket_count: ticketCount ? ticketCount : 0,
      };
    });

    const data: ITestEmailSend = {
      displayConditions: displayConditions,
      language: this.form.get('language')?.value.value,
      to: this.form.get('email')?.value,
    };

    if (this.data.onTestSend) {
      this.dialogRef.close();
      this.form.disable();

      this.data.onTestSend(this.layoutHandlerService.getTemplateId(), data).subscribe(result => {
        this.form.enable();
      });
    }
  }

  onDismiss() {
    this.dialogRef.close(false);
  }

  validateForm(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateForm(control);
      }
    });
  }

  onPreview() {
    if (this.form.valid) {
      this.onSubmit();
    } else {
      this.validateForm(this.form);
    }
  }

}
