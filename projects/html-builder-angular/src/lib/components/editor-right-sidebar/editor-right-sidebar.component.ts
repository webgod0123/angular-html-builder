import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ContentComponentType, Responsive } from '../../enums';
import { ConfigType } from '../../enums/config-type.enum';
import { BuilderInterfaceService } from '../../services/builder-interface.service';

@Component({
  selector: 'editor-right-sidebar',
  templateUrl: './editor-right-sidebar.component.html',
  styleUrls: ['./editor-right-sidebar.component.scss'],
})

export class EditorRightSidebarComponent {

  readonly ContentComponentType = ContentComponentType;
  readonly ConfigType = ConfigType;

  rightMenuOpen$ = this.builderInterfaceService.rightMenuOpen$;
  configType$ = this.builderInterfaceService.configType$;

  @Input() responsive = Responsive.DESKTOP;
  @Input() activeContentComponent: ContentComponentType | null;
  @Output() updateLanguageLayout = new EventEmitter<string>();

  constructor(private builderInterfaceService: BuilderInterfaceService) { }

  switchResponsiveDesign() {
    if (this.responsive === Responsive.DESKTOP) {
      this.responsive = Responsive.MOBILE;
    } else {
      this.responsive = Responsive.DESKTOP;
    }
  }

  updateLangLayout(newId): void {
    this.updateLanguageLayout.emit(newId);
  }

}
