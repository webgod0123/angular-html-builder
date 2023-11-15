import { Component } from '@angular/core';
import { LayoutHandlerService } from '../../../services/layout-handler.service';
import { IHeadValue } from '../../layout-schema.interface';
import { getStyleTag } from '../../renderer/style-tag-helper';
import { BaseRendererComponent } from '../base-renderer.component';

@Component({
  template: '',
})
export abstract class BaseHeadRendererComponent extends BaseRendererComponent<IHeadValue> {

  readonly getStyleTag = getStyleTag;

  constructor(private layoutHandlerService: LayoutHandlerService) {
    super(layoutHandlerService);
  }

  updateHeadBlockText(text: string) {
    this.layoutHandlerService.updateHeadBlockText(this.id, text);
  }

}
