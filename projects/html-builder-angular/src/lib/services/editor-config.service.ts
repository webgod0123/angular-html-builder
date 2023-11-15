import { Inject, Injectable } from '@angular/core';
import { EDITOR_CONFIG_ACCESSOR, IEditorConfig } from '../providers/editor-config.provider';

@Injectable()
export class EditorConfigService {

  constructor(@Inject(EDITOR_CONFIG_ACCESSOR) private readonly editorConfig: IEditorConfig,) { }

  getImagePath(url: string) {
    return `${this.editorConfig.cdnBaseUrl}/${url}`;
  }

}
