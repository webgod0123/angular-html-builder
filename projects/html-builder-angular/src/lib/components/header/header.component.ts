import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AAGUID, TranslateService } from '@interticket/core';
import { ConfirmDialogComponent } from '@interticket/editor-ui-kit';
import { HTMLBuilderType } from '../../enums';
import { ConfigType } from '../../enums/config-type.enum';
import { IHTMLBuilderService } from '../../interfaces';
import { IPreviewTemplateSend, ITestEmailSend } from '../../interfaces/display-condition';
import { IEmailTemplateCreateRequest } from '../../interfaces/email-template-edit.interface';
import { HTML_BUILDER_SERVICE } from '../../providers/email-template-editor-service.provider';
import { BuilderInterfaceService } from '../../services/builder-interface.service';
import { LayoutHandlerService } from '../../services/layout-handler.service';
import { LayoutUndoRedoService } from '../../services/layout-undo-redo.service';
import { CreateTemplateDialogComponent } from '../shared/create-template-dialog/create-template-dialog.component';
import { PreviewSettingsDialogComponent } from '../shared/preview-settings-dialog/preview-settings-dialog.component';
import { TestEmailSendComponent } from '../shared/test-email-send/test-email-send.component';

@Component({
  selector: 'editor-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})

export class HeaderComponent {

  readonly ConfigType = ConfigType;

  leftMenuOpen$ = this.builderInterfaceService.leftMenuOpen$;
  rightMenuOpen$ = this.builderInterfaceService.rightMenuOpen$;
  configType$ = this.builderInterfaceService.configType$;

  @Input() headerBackLink: string;
  @Input() templateLink: string;
  @Input() name = '';
  @Input() displayConditions: string[];
  @Output() activeMode = new EventEmitter<HTMLBuilderType>();
  @Output() onLayoutSave = new EventEmitter();

  readonly HTMLBuilderType = HTMLBuilderType;

  constructor(
    @Inject(HTML_BUILDER_SERVICE) private readonly htmlBuilderService: IHTMLBuilderService,
    private readonly dialog: MatDialog,
    private readonly translateService: TranslateService,
    private layoutUndoRedoService: LayoutUndoRedoService,
    private builderInterfaceService: BuilderInterfaceService,
    private layoutHandlerService: LayoutHandlerService,
  ) { }

  get isTemplate(): boolean {
    return this.layoutHandlerService.isTemplate;
  }

  clickArrowBtn() {
    this.builderInterfaceService.openLeftMenu();
  }

  backToStemX() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: this.translateService.get('confirm_back_to_stem_x'),
        acceptButtonTitle: this.translateService.get('general_lang_yes'),
        cancelButtonTitle: this.translateService.get('general_lang_no'),
      },
      autoFocus: false,
      panelClass: 'confirm-dialog',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }

      window.location.href = this.headerBackLink;
    });
  }

  openTestEmailDialog() {
    this.dialog.open(TestEmailSendComponent, {
      data: {
        title: this.translateService.get('admin_email_template_test_email_send'),
        createTitle: this.translateService.get('admin_email_template_send'),
        displayConditions: this.displayConditions,
        onTestSend: (templateId: AAGUID, data: ITestEmailSend) => this.htmlBuilderService.sendTestEmail(templateId, data),
      },
      autoFocus: false,
      panelClass: 'test-email-send-dialog',
    });
  }

  openEmailCreateDialog() {
    this.dialog.open(CreateTemplateDialogComponent, {
      data: {
        title: this.translateService.get('adming_email_template_create'),
        createTitle: this.translateService.get('general_create'),
        templateLink: this.templateLink,
        onSave: (data: IEmailTemplateCreateRequest) => this.htmlBuilderService.createEmailTemplate(data),
      },
      autoFocus: false,
      panelClass: 'create-template-dialog',
    });
  }

  openPreviewSettingsDialog() {
    this.dialog.open(PreviewSettingsDialogComponent, {
      data: {
        title: this.translateService.get('admin_email_template_preview_settings'),
        createTitle: this.translateService.get('admin_email_template_preview'),
        displayConditions: this.displayConditions,
        onPreview: (templateId: AAGUID, layoutId: AAGUID, displayConditions: IPreviewTemplateSend) => this.htmlBuilderService.previewEmailTemplate(templateId, layoutId, displayConditions),
      },
      autoFocus: false,
      panelClass: 'preview-settings-dialog',
    });
  }

  openLayoutContent() {
    this.builderInterfaceService.openLayoutConfig();
  }

  openBodyContent() {
    this.layoutHandlerService.selectBody();
    this.builderInterfaceService.openBodyConfig();
  }

  toggleConfig() {
    this.builderInterfaceService.toggleConfig();
  }

  saveLayout() {
    this.onLayoutSave.emit();
  }

  isUndoPossible(): boolean {
    return this.layoutUndoRedoService.isUndoPossible();
  }

  undoAction() {
    this.builderInterfaceService.closeConfig();
    this.layoutUndoRedoService.undoState();
  }

  isRedoPossible(): boolean {
    return this.layoutUndoRedoService.isRedoPossible();
  }

  redoAction() {
    this.builderInterfaceService.closeConfig();
    this.layoutUndoRedoService.redoState();
  }

  setModeToWeb(): void {
    this.activeMode.emit(HTMLBuilderType.WEB);
  }

  // TODO: This is just for testing email render, later we should remove it from here
  setModeToEmail(): void {
    this.activeMode.emit(HTMLBuilderType.EMAIL);
  }

}
