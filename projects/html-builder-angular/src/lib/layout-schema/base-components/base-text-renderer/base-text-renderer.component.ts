import { Component } from '@angular/core';
import { ContentComponentType } from '../../../enums';
import { LayoutHandlerService } from '../../../services/layout-handler.service';
import { ITextValue } from '../../layout-schema.interface';
import { getStyleTag } from '../../renderer/style-tag-helper';
import { BaseRendererComponent } from '../base-renderer.component';

@Component({
  template: '',
})
export abstract class BaseTextRendererComponent extends BaseRendererComponent<ITextValue> {

  readonly ContentComponentType = ContentComponentType;
  readonly getStyleTag = getStyleTag;

  constructor(private layoutHandlerService: LayoutHandlerService) {
    super(layoutHandlerService);
  }

  updateTextBlockText(text: string) {
    this.layoutHandlerService.updateTextBlockText(this.id, text);
  }

}
