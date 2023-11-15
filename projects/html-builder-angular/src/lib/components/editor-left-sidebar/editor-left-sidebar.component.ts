import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ContentComponentType } from '../../enums';
import { IContentComponent } from '../../interfaces';
import { BuilderInterfaceService } from '../../services/builder-interface.service';

@Component({
  selector: 'editor-left-sidebar',
  templateUrl: './editor-left-sidebar.component.html',
  styleUrls: ['./editor-left-sidebar.component.scss'],
})

export class EditorLeftSidebarComponent {

  leftMenuOpen$ = this.builderInterfaceService.leftMenuOpen$;

  @Input() contentComponents: IContentComponent[];
  @Input() isActiveSidebarLayer: boolean;
  @Input() activeContentComponent: ContentComponentType | null;

  @Output() activeSidebarLayer = new EventEmitter();

  constructor(private builderInterfaceService: BuilderInterfaceService) { }

  activeLayer(contentComponent: IContentComponent) {
    this.activeSidebarLayer.emit(contentComponent);
  }

}
