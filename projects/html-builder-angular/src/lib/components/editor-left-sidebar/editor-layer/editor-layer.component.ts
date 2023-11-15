import { Component, Input } from '@angular/core';
import { ContentComponentType } from '../../../enums';

@Component({
  selector: 'editor-layer',
  templateUrl: './editor-layer.component.html',
  styleUrls: ['./editor-layer.component.scss'],
})

export class EditorLayerComponent {

  @Input() isActiveLayer: boolean;
  @Input() activeContentComponent: ContentComponentType | null;

  isBlockActive() {
    return this.activeContentComponent === ContentComponentType.BLOCK;
  }

  isVariableActive() {
    return this.activeContentComponent === ContentComponentType.VARIABLE;
  }

  isImageActive() {
    return this.activeContentComponent === ContentComponentType.IMAGE;
  }

  isComponentActive() {
    return this.activeContentComponent === ContentComponentType.COMPONENT;
  }

  isEventActive() {
    return this.activeContentComponent === ContentComponentType.EVENT;
  }

}
