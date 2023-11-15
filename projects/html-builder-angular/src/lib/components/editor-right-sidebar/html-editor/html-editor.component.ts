import { Component, EventEmitter, Input, Output } from '@angular/core';

import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/markdown/markdown';

@Component({
  selector: 'html-editor',
  templateUrl: './html-editor.component.html',
  styleUrls: ['./html-editor.component.scss'],
})
export class HtmlEditorComponent {

  @Output() onChange = new EventEmitter();

  @Input() data: string;

  codeMirrorOptions: any = {
    indentWithTabs: true,
    smartIndent: true,
    lineNumbers: true,
    lineWrapping: false,
    extraKeys: { 'Ctrl-Space': 'autocomplete' },
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
    autoCloseBrackets: true,
    matchBrackets: true,
    lint: true,
    theme: '3024-night',
    mode: 'markdown',
  };

  setEditorContent() {
    this.onChange.emit(this.data);
  }

}
