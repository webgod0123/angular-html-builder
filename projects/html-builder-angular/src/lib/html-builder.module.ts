import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule, DatePipe } from '@angular/common';
import { ModuleWithProviders, NgModule, Type } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatTabsModule } from '@angular/material/tabs';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { AAGUID, MaterialModule, PipeModule, TranslateModule } from '@interticket/core';
import { EditorUIKit } from '@interticket/editor-ui-kit';
import { DndModule } from 'ngx-drag-drop';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ButtonRightSideBarConfigComponent } from './components/content-components/button/button-right-sidebar-config/button-right-sidebar-config.component';
import { ColumnsLeftSideBarConfigComponent } from './components/content-components/columns/columns-left-sidebar-config/columns-left-sidebar-config.component';
import { ColumnsListComponent } from './components/content-components/columns/columns-list/columns-list.component';
import { ColumnsRightSidebarConfigComponent } from './components/content-components/columns/columns-right-sidebar-config/columns-right-sidebar-config.component';
import { ComponentCardComponent } from './components/content-components/components/component-card/component-card.component';
import { ComponentsLeftSideBarConfigComponent } from './components/content-components/components/components-left-sidebar-config/components-left-sidebar-config.component';
import { ComponentsListComponent } from './components/content-components/components/components-list/components-list.component';
import { CreateComponentDialogComponent } from './components/content-components/components/create-component-dialog/create-component-dialog.component';
import { DividerRightSideBarConfigComponent } from './components/content-components/divider/divider-right-sidebar-config/divider-right-sidebar-config.component';
import { EventLeftSidebarConfigComponent } from './components/content-components/event/event-left-sidebar-config/event-left-sidebar-config.component';
import { EventListComponent } from './components/content-components/event/event-list/event-list.component';
import { EventRightSidebarConfigComponent } from './components/content-components/event/event-right-sidebar-config/event-right-sidebar-config.component';
import { HeadRightSideBarConfigComponent } from './components/content-components/head/head-right-sidebar-config/head-right-sidebar-config.component';
import { HtmlRightSideBarConfigComponent } from './components/content-components/html/html-right-sidebar-config/html-right-sidebar-config.component';
import { ImageLeftSideBarConfigComponent } from './components/content-components/image/image-left-sidebar-config/image-left-sidebar-config.component';
import { ImageRightSidebarConfigComponent } from './components/content-components/image/image-right-sidebar-config/image-right-sidebar-config.component';
import { MenuRightSidebarConfigComponent } from './components/content-components/menu/menu-right-sidebar-config/menu-right-sidebar-config.component';
import { TextRightSideBarConfigComponent } from './components/content-components/text/text-right-sidebar-config/text-right-sidebar-config.component';
import { VariablesLeftSideBarConfigComponent } from './components/content-components/variables/variables-left-sidebar-config/variables-left-sidebar-config.component';
import { ContentComponentListComponent } from './components/editor-left-sidebar/content-component-list/content-component-list.component';
import { EditorLayerComponent } from './components/editor-left-sidebar/editor-layer/editor-layer.component';
import { EditorLeftSidebarComponent } from './components/editor-left-sidebar/editor-left-sidebar.component';
import { BackgroundImageRepeatFormComponent } from './components/editor-right-sidebar/background-image-repeat-form/background-image-repeat-form.component';
import { BackgroundPositionFormComponent } from './components/editor-right-sidebar/background-position-form/background-position-form.component';
import { BodyContentComponent } from './components/editor-right-sidebar/body-content/body-content.component';
import { BorderFormComponent } from './components/editor-right-sidebar/border-form/border-form.component';
import { ConfigurationContentComponent } from './components/editor-right-sidebar/configuration-content/configuration-content.component';
import { EditorRightSidebarComponent } from './components/editor-right-sidebar/editor-right-sidebar.component';
import { ElementAlignmentComponent } from './components/editor-right-sidebar/element-alignment/element-alignment.component';
import { HeadingTypeComponent } from './components/editor-right-sidebar/heading-type/heading-type.component';
import { HtmlEditorComponent } from './components/editor-right-sidebar/html-editor/html-editor.component';
import { ImageUploadFormComponent } from './components/editor-right-sidebar/image-upload-form/image-upload-form.component';
import { InlineEditorComponent } from './components/editor-right-sidebar/inline-editor/inline-editor.component';
import { LanguageContentComponent } from './components/editor-right-sidebar/language-content/language-content.component';
import { PaddingFormComponent } from './components/editor-right-sidebar/padding-form/padding-form.component';
import { RoundedBorderFormComponent } from './components/editor-right-sidebar/rounded-border-form/rounded-border-form.component';
import { ToggleSwitchElementComponent } from './components/editor-right-sidebar/toggle-switch-element/toggle-switch-element.component';
import { VariablesConfigComponent } from './components/editor-right-sidebar/variables-config/variables-config.component';
import { HeaderComponent } from './components/header/header.component';
import { HtmlBuilderComponent } from './components/html-builder/html-builder.component';
import { ComponentActionsComponent } from './components/layout-canvas/component-actions/component-actions.component';
import { ComponentDragHandleComponent } from './components/layout-canvas/component-drag-handle/component-drag-handle.component';
import { LayoutCanvasComponent } from './components/layout-canvas/layout-canvas.component';
import { LayoutRenderEmailComponent } from './components/layout-render-email/layout-render-email.component';
import { RenderEmailBodyComponent } from './components/layout-render-email/render-email-body/render-email-body.component';
import { RenderEmailButtonComponent } from './components/layout-render-email/render-email-button/render-email-button.component';
import { RenderEmailDisplayConditionsComponent } from './components/layout-render-email/render-email-display-conditions/render-email-display-conditions.component';
import { RenderEmailDividerComponent } from './components/layout-render-email/render-email-divider/render-email-divider.component';
import { RenderEmailHeadComponent } from './components/layout-render-email/render-email-head/render-email-head.component';
import { RenderEmailHtmlComponent } from './components/layout-render-email/render-email-html/render-email-html.component';
import { RenderEmailImageComponent } from './components/layout-render-email/render-email-image/render-email-image.component';
import { RenderEmailMenuComponent } from './components/layout-render-email/render-email-menu/render-email-menu.component';
import { RenderEmailRowComponent, RenderEmailColumnComponent, RenderEmailContentComponent, RenderEmailEventComponent } from './components/layout-render-email/render-email-row/render-email-row.component';
import { RenderEmailTextComponent } from './components/layout-render-email/render-email-text/render-email-text.component';
import { RenderEmailVariableComponent } from './components/layout-render-email/render-email-variable/render-email-variable.component';
import { LayoutRenderHtmlComponent } from './components/layout-render-html/layout-render-html.component';
import { RenderHtmlBodyComponent } from './components/layout-render-html/render-html-body/render-html-body.component';
import { RenderHtmlButtonComponent } from './components/layout-render-html/render-html-button/render-html-button.component';
import { RenderHtmlDisplayConditionsComponent } from './components/layout-render-html/render-html-display-conditions/render-html-display-conditions.component';
import { RenderHtmlDividerComponent } from './components/layout-render-html/render-html-divider/render-html-divider.component';
import { RenderHtmlHeadComponent } from './components/layout-render-html/render-html-head/render-html-head.component';
import { RenderHtmlHtmlComponent } from './components/layout-render-html/render-html-html/render-html-html.component';
import { RenderHtmlImageComponent } from './components/layout-render-html/render-html-image/render-html-image.component';
import { RenderHtmlMenuComponent } from './components/layout-render-html/render-html-menu/render-html-menu.component';
import { RenderHtmlRowComponent, RenderHtmlColumnComponent, RenderHtmlContentComponent, RenderHtmlEventComponent } from './components/layout-render-html/render-html-row/render-html-row.component';
import { RenderHtmlTextComponent } from './components/layout-render-html/render-html-text/render-html-text.component';
import { RenderHtmlVariableComponent } from './components/layout-render-html/render-html-variable/render-html-variable.component';
import { CreateTemplateDialogComponent } from './components/shared/create-template-dialog/create-template-dialog.component';
import { PreviewDialogComponent } from './components/shared/preview-dialog/preview-dialog.component';
import { PreviewResolutionsComponent } from './components/shared/preview-resolutions/preview-resolutions.component';
import { ComponentHighlightDirective } from './directives/component-highlight.directive';
import { IHTMLBuilderService } from './interfaces';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { EDITOR_CONFIG_ACCESSOR, IEditorConfig } from './providers/editor-config.provider';
import { HTML_BUILDER_SERVICE } from './providers/email-template-editor-service.provider';
import { PARTNER_ID_ACCESSOR } from './providers/partner-id.provider';
import { BodyHandlerService } from './services/body-handler.service';
import { BuilderInterfaceService } from './services/builder-interface.service';
import { ButtonHandlerService } from './services/button-handler.service';
import { DividerHandlerService } from './services/divider-handler.service';
import { EditorConfigService } from './services/editor-config.service';
import { HeadHandlerService } from './services/head-handler.service';
import { MockHTMLBuilderService } from './services/html-builder-mock.service';
import { HtmlHandlerService } from './services/html-handler.service';
import { ImageHandlerService } from './services/image-handler.service';
import { InitialValuesService } from './services/initial-values.service';
import { LayoutExporterService } from './services/layout-exporter.service';
import { LayoutHandlerService } from './services/layout-handler.service';
import { LayoutStateService } from './services/layout-state.service';
import { LayoutUndoRedoService } from './services/layout-undo-redo.service';
import { MenuHandlerService } from './services/menu-handler-service.service';
import { PartnerHierarchyService } from './services/partner-hierarchy.service';
import { RowHandlerService } from './services/row-handler.service';
import { TextHandlerService } from './services/text-handler.service';
import { VariablesHandlerService } from './services/variables-handler.service';
import { PreviewSettingsDialogComponent } from './components/shared/preview-settings-dialog/preview-settings-dialog.component';
import { TestEmailSendComponent } from './components/shared/test-email-send/test-email-send.component';

export interface IHtmlBuilderModuleConfig {
  htmlBuilderService?: Type<IHTMLBuilderService>;
  editorConfig?: IEditorConfig;
  partnerId?: AAGUID;
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    PipeModule,
    ReactiveFormsModule,
    MaterialModule,
    EditorUIKit,
    DndModule,
    MatGridListModule,
    MatButtonModule,
    MatSelectModule,
    MatListModule,
    ScrollingModule,
    NgScrollbarModule,
    MatExpansionModule,
    MatDialogModule,
    MatCheckboxModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatSliderModule,
    CKEditorModule,
    CodemirrorModule,
    NgxPermissionsModule.forChild(),
  ],
  declarations: [
    HtmlBuilderComponent,
    HeaderComponent,
    EditorLeftSidebarComponent,
    ContentComponentListComponent,
    EditorLayerComponent,
    ColumnsLeftSideBarConfigComponent,
    VariablesLeftSideBarConfigComponent,
    ImageLeftSideBarConfigComponent,
    ComponentsLeftSideBarConfigComponent,
    ComponentsListComponent,
    EditorRightSidebarComponent,
    BodyContentComponent,
    LanguageContentComponent,
    ConfigurationContentComponent,
    ElementAlignmentComponent,
    HeadingTypeComponent,
    ToggleSwitchElementComponent,
    TextRightSideBarConfigComponent,
    HeadRightSideBarConfigComponent,
    ButtonRightSideBarConfigComponent,
    HtmlRightSideBarConfigComponent,
    DividerRightSideBarConfigComponent,
    PreviewDialogComponent,
    CreateComponentDialogComponent,
    PreviewResolutionsComponent,
    VariablesConfigComponent,
    ColumnsListComponent,
    ColumnsRightSidebarConfigComponent,
    PaddingFormComponent,
    RoundedBorderFormComponent,
    ImageUploadFormComponent,
    BorderFormComponent,
    HtmlEditorComponent,
    LayoutRenderHtmlComponent,
    RenderHtmlBodyComponent,
    RenderHtmlRowComponent,
    RenderHtmlColumnComponent,
    RenderHtmlContentComponent,
    RenderHtmlTextComponent,
    RenderHtmlHeadComponent,
    RenderHtmlVariableComponent,
    RenderHtmlMenuComponent,
    RenderHtmlDividerComponent,
    RenderHtmlEventComponent,
    RenderHtmlHtmlComponent,
    RenderEmailMenuComponent,
    LayoutRenderEmailComponent,
    RenderEmailBodyComponent,
    RenderEmailRowComponent,
    RenderEmailColumnComponent,
    RenderEmailContentComponent,
    RenderEmailTextComponent,
    RenderEmailHeadComponent,
    RenderEmailVariableComponent,
    RenderEmailHtmlComponent,
    RenderEmailDisplayConditionsComponent,
    LayoutCanvasComponent,
    ImageRightSidebarConfigComponent,
    RenderHtmlImageComponent,
    RenderEmailImageComponent,
    RenderHtmlButtonComponent,
    RenderEmailButtonComponent,
    RenderEmailDividerComponent,
    RenderEmailEventComponent,
    MenuRightSidebarConfigComponent,
    ComponentHighlightDirective,
    ComponentActionsComponent,
    RenderHtmlDisplayConditionsComponent,
    ComponentCardComponent,
    ComponentDragHandleComponent,
    BackgroundImageRepeatFormComponent,
    BackgroundPositionFormComponent,
    EventLeftSidebarConfigComponent,
    EventRightSidebarConfigComponent,
    EventListComponent,
    SafeHtmlPipe,
    InlineEditorComponent,
    CreateTemplateDialogComponent,
    PreviewSettingsDialogComponent,
    TestEmailSendComponent,
  ],
  providers: [
    DatePipe,
    LayoutStateService,
    LayoutHandlerService,
    LayoutUndoRedoService,
    VariablesHandlerService,
    TextHandlerService,
    ImageHandlerService,
    ButtonHandlerService,
    HtmlHandlerService,
    InitialValuesService,
    MenuHandlerService,
    HeadHandlerService,
    BodyHandlerService,
    RowHandlerService,
    EditorConfigService,
    BuilderInterfaceService,
    LayoutExporterService,
    DividerHandlerService,
    PartnerHierarchyService,
  ],
  exports: [HtmlBuilderComponent],
})
export class HtmlBuilderModule {

  static forRoot(config?: IHtmlBuilderModuleConfig): ModuleWithProviders<HtmlBuilderModule> {
    return {
      ngModule: HtmlBuilderModule,
      providers: [
        { provide: HTML_BUILDER_SERVICE, useClass: config?.htmlBuilderService || MockHTMLBuilderService },
        { provide: PARTNER_ID_ACCESSOR, useValue: config?.partnerId || null },
        { provide: EDITOR_CONFIG_ACCESSOR, useValue: config?.editorConfig || {} },
      ],
    };
  }

}
