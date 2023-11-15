import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';
import { ContentComponentType } from '../../../../enums';
import { IHTMLBuilderService } from '../../../../interfaces';
import { IEmailComponentListItem } from '../../../../interfaces/email-component-list-item.interface';
import { HTML_BUILDER_SERVICE } from '../../../../providers/email-template-editor-service.provider';
import { EditorConfigService } from '../../../../services/editor-config.service';
import { CreateComponentDialogComponent } from '../create-component-dialog/create-component-dialog.component';

@Component({
  selector: 'components-left-sidebar-config',
  templateUrl: './components-left-sidebar-config.component.html',
  styleUrls: ['./components-left-sidebar-config.component.scss'],
})

export class ComponentsLeftSideBarConfigComponent implements OnInit {

  isLoading = false;
  isShowingAll = false;
  componentList: IEmailComponentListItem[] = [];

  readonly ContentComponentType = ContentComponentType;

  constructor(
    private readonly dialog: MatDialog,
    @Inject(HTML_BUILDER_SERVICE) private readonly htmlBuilderService: IHTMLBuilderService,
    private readonly editorConfigService: EditorConfigService,
  ) {

  }

  ngOnInit(): void {
    this.loadComponents();
  }

  getImagePath(url: string) {
    return this.editorConfigService.getImagePath(url);
  }

  private loadComponents() {
    this.isLoading = true;

    this.htmlBuilderService.getComponentList(10, 0)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe((data) => {
        this.componentList = data.results || [];
      });
  }

  onSelectComponent(component: IEmailComponentListItem): void {
    //
  }

  toggleShowing(): void {
    this.isShowingAll = !this.isShowingAll;
  }

  createNewComponent(): void {
    this.dialog.open(CreateComponentDialogComponent, {
      autoFocus: false,
      panelClass: 'create-dialog',
    });
  }

}
