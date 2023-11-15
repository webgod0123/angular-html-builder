import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AAGUID, TranslateService } from '@interticket/core';
import { IHTMLBuilderService } from '../../../interfaces';
import { ITestEmailSend } from '../../../interfaces/display-condition';
import { HTML_BUILDER_SERVICE } from '../../../providers/email-template-editor-service.provider';
import { TestEmailSendComponent } from '../test-email-send/test-email-send.component';

interface IPreviewSettingsDialogData {
  layoutHTML: string;
  displayConditions: string[]
}

@Component({
  selector: 'preview-dialog',
  templateUrl: './preview-dialog.component.html',
  styleUrls: ['./preview-dialog.component.scss'],
})

export class PreviewDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public readonly data: IPreviewSettingsDialogData,
    @Inject(HTML_BUILDER_SERVICE) private readonly htmlBuilderService: IHTMLBuilderService,
    private readonly dialog: MatDialog,
    private readonly translateService: TranslateService,

  ) {

  }

  openTestEmailDialog() {
    this.dialog.open(TestEmailSendComponent, {
      data: {
        title: this.translateService.get('admin_email_template_test_email_send'),
        createTitle: this.translateService.get('admin_email_template_send'),
        displayConditions: this.data.displayConditions,
        onTestSend: (templateId: AAGUID, data: ITestEmailSend) => this.htmlBuilderService.sendTestEmail(templateId, data),
      },
      autoFocus: false,
      panelClass: 'test-email-send-dialog',
    });
  }

}
