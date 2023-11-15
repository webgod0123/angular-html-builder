import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@interticket/core';
import { ConfirmDialogComponent } from '@interticket/editor-ui-kit';

import { ComponentAction, Responsive } from '../../../enums';
import { BuilderInterfaceService } from '../../../services/builder-interface.service';
import { LayoutHandlerService } from '../../../services/layout-handler.service';

@Component({
  selector: 'configuration-content',
  templateUrl: './configuration-content.component.html',
  styleUrls: ['./configuration-content.component.scss'],
})

export class ConfigurationContentComponent {

  @Input() title: string;
  @Input() responsive: Responsive;
  @Output() switchResponsive = new EventEmitter();

  locked$ = this.layoutHandlerService.lastSelectedContentLocked$;

  constructor(
    private readonly dialog: MatDialog,
    private readonly translateService: TranslateService,
    private readonly layoutHandlerService: LayoutHandlerService,
    private readonly builderInterfaceService: BuilderInterfaceService,
  ) {

  }

  // Todo: Need to be defined in the Service
  switchResponsiveDesign() {
    this.switchResponsive.emit();
  }

  isDesktop() {
    return this.responsive === Responsive.DESKTOP;
  }

  isMobile() {
    return this.responsive === Responsive.MOBILE;
  }

  deleteContent() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: this.translateService.get('admin_confirm_delete'),
        acceptButtonTitle: this.translateService.get('general_lang_yes'),
        cancelButtonTitle: this.translateService.get('general_lang_no'),
      },
      autoFocus: false,
      panelClass: 'confirm-dialog',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }

      this.layoutHandlerService.handleContentLayout(ComponentAction.REMOVE);
      this.builderInterfaceService.closeConfig();
    });
  }

  duplicateContent() {
    this.layoutHandlerService.handleContentLayout(ComponentAction.DUPLICATE);
  }

  lock() {
    this.layoutHandlerService.handleContentLayout(ComponentAction.PADLOCK);
  }

}
