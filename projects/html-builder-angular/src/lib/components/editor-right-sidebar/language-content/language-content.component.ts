import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@interticket/core';
import { ConfirmDialogComponent } from '@interticket/editor-ui-kit';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IHTMLBuilderService } from '../../../interfaces';
import { ILanguageLayout, ILayout } from '../../../layout-schema/layout-schema.interface';
import { HTML_BUILDER_SERVICE } from '../../../providers/email-template-editor-service.provider';
import { LayoutHandlerService } from '../../../services/layout-handler.service';

@Component({
  selector: 'language-content',
  templateUrl: './language-content.component.html',
  styleUrls: ['./language-content.component.scss'],
})

export class LanguageContentComponent implements OnInit, OnDestroy {

  private templateId: string;

  languages: ILanguageLayout[] = [];
  currentLanguage: ILanguageLayout | null = null;
  form: FormGroup;

  @Output() updateLanguageLayout = new EventEmitter<string>();

  private readonly ngOnDestroySubject = new Subject();

  constructor(
    @Inject(HTML_BUILDER_SERVICE) readonly htmlBuilderService: IHTMLBuilderService,
    private layoutHandlerService: LayoutHandlerService,
    private translateService: TranslateService,
    private readonly dialog: MatDialog) {
    this.initForm();
  }

  private initForm() {
    this.form = new FormGroup({
      languageId: new FormControl(this.currentLanguage?.id),
    });
  }

  ngOnInit(): void {
    this.layoutHandlerService.templateId$.subscribe((templateId) => {
      if (!templateId) {
        return;
      }

      this.templateId = templateId;
      this.subscribeForValues();
      this.subscribeFormChanges();
    });

    this.layoutHandlerService.layoutId$.subscribe((layoutId) => {
      if (!layoutId) {
        return;
      }

      const selectedLanguage = this.languages.find(e => e.id === layoutId);
      if (selectedLanguage) {
        this.currentLanguage = selectedLanguage;
      }
    });
  }

  ngOnDestroy(): void {
    this.ngOnDestroySubject.next(true);
  }

  formValue(formControl: string) {
    return this.form.get(formControl)?.value;
  }

  private subscribeForValues() {
    this.htmlBuilderService.getLanguageLayoutList(this.templateId)
      .pipe(takeUntil(this.ngOnDestroySubject.asObservable()))
      .subscribe((data) => {
        this.languages = data || [];
        if (this.languages.length === 0) {
          return;
        }

        this.languages = this.languages.map((item) => ({
          ...item, language: this.translateService.get(`lang_label_${item.language}`),
        }));

        let selectedLanguage = this.languages.find(e => e.id === this.layoutHandlerService.getLayoutId());
        if (!selectedLanguage) {
          selectedLanguage = this.languages[0];
          this.layoutHandlerService.setLayoutId(selectedLanguage.id);
        }

        this.populateFormWithValues(selectedLanguage);
      });
  }

  private populateFormWithValues(newValue: ILanguageLayout) {
    if (!newValue) {
      return;
    }

    this.currentLanguage = newValue;

    this.form.patchValue({
      languageId: newValue.id,
    }, { emitEvent: false });
  }

  private subscribeFormChanges() {
    this.form
      .valueChanges
      .pipe(takeUntil(this.ngOnDestroySubject.asObservable()))
      .subscribe(newValues => {
        if (newValues.languageId !== this.currentLanguage?.id) {
          const language = this.languages.find(({ id }) => id === newValues.languageId);
          if (language) {
            this.changeLanguage(language);
          }
        }
      });
  }

  private changeLanguage(language: ILanguageLayout) {
    this.updateLanguageLayout.emit(language.id);
  }

  onAdoptContent(): void {
    if (!this.layoutHandlerService.isLayoutUpdated()) {
      this.updateByDefaultLanguageLayout();
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: this.translateService.get('admin_email_template_confirm_update_by_default'),
        acceptButtonTitle: this.translateService.get('general_lang_yes'),
        cancelButtonTitle: this.translateService.get('general_lang_no'),
      },
      autoFocus: false,
      panelClass: 'confirm-dialog',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateByDefaultLanguageLayout();
      }
    });
  }

  updateByDefaultLanguageLayout(): void {
    this.htmlBuilderService.getDefaultLanguageLayout(this.templateId)
      .pipe(takeUntil(this.ngOnDestroySubject.asObservable()))
      .subscribe(defaultLayout => {
        const selectedLanguage = this.languages.find(e => e.id === defaultLayout.id);
        if (selectedLanguage) {
          this.layoutHandlerService.setLayoutId(defaultLayout.id);
          this.layoutHandlerService.initialLayout = this.layoutHandlerService.getCurrentLayout() as ILayout;
          this.htmlBuilderService.loadLayout(this.templateId, defaultLayout.id);

          this.populateFormWithValues(selectedLanguage);
        }
      });
  }

}
