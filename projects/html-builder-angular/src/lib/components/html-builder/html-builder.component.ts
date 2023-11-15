import { Component, Inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@interticket/core';
import { ConfirmDialogComponent } from '@interticket/editor-ui-kit';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { ContentComponentType, HTMLBuilderType } from '../../enums';
import { IContentComponent, IHTMLBuilderService } from '../../interfaces';
import { ILayout } from '../../layout-schema/layout-schema.interface';
import { HTML_BUILDER_SERVICE } from '../../providers/email-template-editor-service.provider';
import { BuilderInterfaceService } from '../../services/builder-interface.service';
import { LayoutHandlerService } from '../../services/layout-handler.service';
import { LayoutCanvasComponent } from '../layout-canvas/layout-canvas.component';

@Component({
  selector: 'lib-html-builder',
  templateUrl: './html-builder.component.html',
  styleUrls: ['./html-builder.component.scss'],
})

export class HtmlBuilderComponent implements OnInit, OnDestroy {

  private _templateId: string;
  private _componentId: string;
  private _layoutId: string;

  @Input() htmlName: string;
  @Input() headerBackLink: string;
  @Input() templateLink: string;
  @Input() markupVersionToSave: HTMLBuilderType = HTMLBuilderType.EMAIL;

  @Input()
  set templateId(id: string) {
    this._templateId = id;
    this.layoutHandlerService.setTemplateId(id);
  }

  get templateId(): string {
    return this._templateId;
  }

  @Input()
  set componentId(id: string) {
    this._componentId = id;
    this.layoutHandlerService.setComponentId(id);
  }

  get componentId(): string {
    return this._componentId;
  }

  @Input()
  set layoutId(id: string) {
    this._layoutId = id;
    this.layoutHandlerService.setLayoutId(id);
  }

  get layoutId(): string {
    return this._layoutId;
  }

  @ViewChild('LayoutCanvas', { static: true }) LayoutCanvas: LayoutCanvasComponent;

  contentComponents: IContentComponent[];

  layout: ILayout;

  type: HTMLBuilderType = HTMLBuilderType.WEB;
  isActiveSidebarLayer = false;
  activeContentComponent: ContentComponentType | null;
  displayConditions: string[];

  private readonly ngOnDestroySubject = new Subject();

  constructor(public layoutHandlerService: LayoutHandlerService,
    @Inject(HTML_BUILDER_SERVICE) private readonly htmlBuilderService: IHTMLBuilderService,
    private builderInterfaceService: BuilderInterfaceService,
    private readonly translateService: TranslateService,
    private readonly dialog: MatDialog,) { }

  ngOnInit(): void {
    this.loadLayout();
    this.setupComponents();
    this.addActiveComponentEditListener();
    this.getDisplayConditions();
  }

  ngOnDestroy(): void {
    this.ngOnDestroySubject.next(true);
  }

  getDisplayConditions() {
    this.htmlBuilderService.getDisplayConditions().pipe(
      takeUntil(this.ngOnDestroySubject.asObservable())
    ).subscribe((displayConditions) => {
      this.displayConditions = displayConditions;
    });
  }

  activeSidebarLayer(contentComponent: IContentComponent) {
    if (contentComponent.effectAllowed) {
      this.isActiveSidebarLayer = false;

      this.builderInterfaceService.setHasSubLeftMenu(false);
      this.builderInterfaceService.setIsSmallLeftMenu(true);
    } else {
      if (this.activeContentComponent === contentComponent.type && this.isActiveSidebarLayer) {
        this.isActiveSidebarLayer = false;

        this.builderInterfaceService.setHasSubLeftMenu(false);
        this.builderInterfaceService.setIsSmallLeftMenu(true);
      } else if (!this.isActiveSidebarLayer) {
        this.isActiveSidebarLayer = true;

        this.builderInterfaceService.setHasSubLeftMenu(true);
        this.builderInterfaceService.setIsSmallLeftMenu(false);
      }
    }
    if (this.activeContentComponent === contentComponent.type) {
      this.activeContentComponent = null;
      this.builderInterfaceService.closeConfig();
    } else {
      this.activeContentComponent = contentComponent.type;
      this.builderInterfaceService.openContentConfig();
    }
  }

  updateType(newType: HTMLBuilderType): void {
    this.type = newType;
  }

  onLayoutSave() {
    const json = this.layoutHandlerService.getCurrentLayout() as ILayout;

    if (this.layoutHandlerService.isTemplate) {
      this.LayoutCanvas.getRenderedLayout(this.markupVersionToSave)
        .pipe(switchMap(cleanedHtml => this.htmlBuilderService.saveLayout(this.templateId, this.layoutId, json, cleanedHtml)))
        .subscribe();
    } else {
      this.htmlBuilderService.saveComponent(this.componentId, this.htmlName, json.body.rows[0]);
    }
  }

  private addActiveComponentEditListener() {
    this.layoutHandlerService.activeContentComponentTypeForEdit$.pipe(
      takeUntil(this.ngOnDestroySubject.asObservable())
    )
      .subscribe((contentComponentType) => {
        if (contentComponentType) {
          this.activeContentComponent = contentComponentType;
          this.builderInterfaceService.openContentConfig();
        }
      });
  }

  private loadLayout() {
    if (this.layoutHandlerService.isTemplate) {
      this.htmlBuilderService.loadLayout(this.templateId, this.layoutId).subscribe(layout => {
        this.layout = layout;
      });
    } else {
      this.htmlBuilderService.loadComponent(this.componentId).subscribe(component => {
        this.layout = this.layoutHandlerService.createLayoutForComponent(component);
      });
    }
  }

  private setupComponents() {
    this.contentComponents = [
      {
        title: 'Block',
        icon: 'block',
        tooltip: 'Block',
        type: ContentComponentType.BLOCK,
      },
      {
        title: 'Event',
        icon: 'event',
        tooltip: 'Event',
        type: ContentComponentType.EVENT,
      },
      {
        title: 'Var',
        icon: 'setting',
        tooltip: 'Variable',
        type: ContentComponentType.VARIABLE,
      },
      {
        title: 'Components',
        icon: 'component',
        tooltip: 'Components',
        type: ContentComponentType.COMPONENT,
      },
      {
        title: 'Text',
        icon: 'text',
        tooltip: 'Text',
        type: ContentComponentType.TEXT,
        effectAllowed: 'copy',
      },
      {
        title: 'Head',
        icon: 'heading',
        tooltip: 'Head',
        type: ContentComponentType.HEAD,
        effectAllowed: 'copy',
      },
      {
        title: 'Button',
        icon: 'button',
        tooltip: 'Button',
        type: ContentComponentType.BUTTON,
        effectAllowed: 'copy',
      },
      {
        title: 'Divider',
        icon: 'divider',
        tooltip: 'Divider',
        type: ContentComponentType.DIVIDER,
        effectAllowed: 'copy',
      },
      {
        title: 'Image',
        icon: 'image',
        tooltip: 'Image',
        type: ContentComponentType.IMAGE,
      },
      {
        title: 'HTML',
        icon: 'html',
        tooltip: 'HTML',
        type: ContentComponentType.HTML,
        effectAllowed: 'copy',
      },
      {
        title: 'Menu',
        icon: 'menu',
        tooltip: 'Menu',
        type: ContentComponentType.MENU,
        effectAllowed: 'copy',
      },
    ];
  }

  updateLanguageLayout(newId: string): void {
    if (!this.layoutHandlerService.isLayoutUpdated()) {
      this.layoutId = newId;
      this.layoutHandlerService.setLayoutId(newId);
      this.loadLayout();
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: this.translateService.get('admin_email_template_confirm_save_changes'),
        acceptButtonTitle: this.translateService.get('general_lang_yes'),
        cancelButtonTitle: this.translateService.get('general_lang_no'),
      },
      autoFocus: false,
      panelClass: 'confirm-dialog',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onLayoutSave();
      }

      this.layoutHandlerService.initialLayout = this.layoutHandlerService.getCurrentLayout() as ILayout;
      this.layoutId = newId;
      this.layoutHandlerService.setLayoutId(newId);
      this.loadLayout();
    });
  }

}
