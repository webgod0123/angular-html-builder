import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AAGUID } from '@interticket/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { IDisplayCondition, IPreviewTemplateSend } from '../../../interfaces/display-condition';
import { IEmailTemplatePreview } from '../../../interfaces/email-template-preview.interface';
import { LayoutHandlerService } from '../../../services/layout-handler.service';
import { PreviewDialogComponent } from '../preview-dialog/preview-dialog.component';

interface IPreviewSettingsDialogData {
  title: string;
  createTitle: string;
  displayConditions: string[];
  onPreview?: (templateId: AAGUID, layoutId: AAGUID, displayConditions: IPreviewTemplateSend) => Observable<IEmailTemplatePreview>
}

@Component({
  selector: 'preview-settings-dialog',
  templateUrl: './preview-settings-dialog.component.html',
  styleUrls: ['./preview-settings-dialog.component.scss'],
})
export class PreviewSettingsDialogComponent implements OnInit, OnDestroy {

  templateId: AAGUID | null;
  layoutId: AAGUID | null;

  form: UntypedFormGroup;
  eventsLabel = 'EventCount';
  ticketsLabel = 'TicketCount';

  private readonly ngOnDestroySubject = new Subject();
  private subscriptions: Subscription[] = [];

  constructor(
    private readonly dialogRef: MatDialogRef<PreviewSettingsDialogComponent>,
    private formBuilder: UntypedFormBuilder,
    private layoutHandlerService: LayoutHandlerService,
    private readonly dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public readonly data: IPreviewSettingsDialogData,
  ) { }

  ngOnInit(): void {
    this.createForms(this.data.displayConditions);

    this.subscriptions.push(this.layoutHandlerService.templateId$.subscribe(templateId => this.templateId = templateId));
    this.subscriptions.push(this.layoutHandlerService.layoutId$.subscribe(layoutId => this.layoutId = layoutId));
  }

  ngOnDestroy(): void {
    this.ngOnDestroySubject.next(true);
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
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

  hasError(label: string) {
    return !!this.form.controls[label].errors?.max;
  }

  formError(label: string) {
    return this.form.controls[label].errors?.max.max;
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

    if (this.data.onPreview) {
      this.dialogRef.close();
      this.form.disable();

      this.data.onPreview(this.templateId || '', this.layoutId || '', { displayConditions }).subscribe(result => {
        this.form.enable();

        if (result.layoutHtml) {
          this.dialog.open(PreviewDialogComponent, {
            data: {
              layoutHTML: result.layoutHtml,
              displayConditions: this.data.displayConditions,
            },
            panelClass: 'preview-dialog',
          });
        }
      });
    }
  }

  onDismiss() {
    this.dialogRef.close(false);
  }

  onPreview() {
    if (this.form.valid) {
      this.onSubmit();
    }
  }

}
