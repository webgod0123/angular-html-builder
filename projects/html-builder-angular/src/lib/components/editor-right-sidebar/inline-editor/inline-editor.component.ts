import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { first } from 'rxjs/operators';
import { CKEditor5 } from '@ckeditor/ckeditor5-angular';
import * as CKEditor from '@interticket/ckeditor5';
import { TranslateService } from '@interticket/core';
import { LayoutHandlerService } from '../../../services/layout-handler.service';
import { VariableContextService } from '../../../services/variable-context.service';

@Component({
  selector: 'inline-editor',
  templateUrl: './inline-editor.component.html',
  styleUrls: ['./inline-editor.component.scss'],
})
export class InlineEditorComponent implements OnInit {

  Editor: CKEditor5.EditorConstructor = CKEditor.InlineEditor;

  isConfigReady = false;

  /**
   * Editor config object
   */
  @Input() config: CKEditor5.Config;

  /**
   * Editor html content
   */
  @Input() value: string;

  @Input() id: string;

  @Output() onEditFinished = new EventEmitter<string>();

  private variableList: string[] = [];

  constructor(private layoutHandlerService: LayoutHandlerService,
    private variableContextService: VariableContextService,
    private translate: TranslateService) {}

  ngOnInit(): void {
    this.initializeVariables();
    this.setConfig();
  }

  /**
   * Fires with the editor instance
   * Emit ready true
   * @param { CKEditor5.Editor} editor
   */
  onReadyCKEditor(editor: CKEditor5.Editor): void {
    this.addFocusChangeListener(editor);
  }

  private setConfig(): void {
    this.config = {
      language: this.translate.currentLang,
      fontFamily: {
        options: [
          'default',
          'Ubuntu, Arial, sans-serif',
          'Ubuntu Mono, Courier New, Courier, monospace',
        ],
      },
      toolbar: {
        items: [
          'fontFamily',
          'fontSize',
          '|',
          'bold',
          'italic',
          'underline',
          'strikethrough',
          '|',
          'alignment',
          '|',
          'bulletedList',
          'numberedList',
          '|',
          'fontColor',
          'fontBackgroundColor',
          '|',
          'link',
          'variables',
        ],
        shouldNotGroupWhenFull: true,
      },
      variablesConfig: {
        types: this.variableList,
      },
      ...this.config,
    };
  }

  private addFocusChangeListener(editor: CKEditor5.Editor): void {
    editor.ui.focusTracker.on('change:isFocused', (event, name, isFocused) => {
      if (!isFocused) {
        this.onEditFinished.emit(editor.getData());
      }
    });
  }

  private initializeVariables() {
    const variableContext = this.layoutHandlerService.getVariableContext(this.id);

    this.variableContextService
      .getContextVariables(variableContext)
      .pipe(first())
      .subscribe(variableList => {
        this.variableList = variableList.map(i => i.value);
        this.isConfigReady = true;
      });
  }

}
