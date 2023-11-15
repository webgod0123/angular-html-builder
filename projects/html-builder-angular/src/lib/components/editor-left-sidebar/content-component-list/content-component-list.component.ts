import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EffectAllowed } from 'ngx-drag-drop';
import { ContentComponentType } from '../../../enums';
import { IContentComponent } from '../../../interfaces';

@Component({
  selector: 'content-component-list',
  templateUrl: './content-component-list.component.html',
  styleUrls: ['./content-component-list.component.scss'],
})

export class ContentComponentListComponent {

  @Input() contentComponents: IContentComponent[];
  @Output() activeLayer = new EventEmitter();
  @Input() activeContentComponent: ContentComponentType | null;

  readonly defaultEffectAllowed: EffectAllowed = 'all';

  selectContentComponent(contentComponent: IContentComponent) {
    this.activeLayer.emit(contentComponent);
  }

}
