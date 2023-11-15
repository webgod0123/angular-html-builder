import { AAGUID } from '@interticket/core';
import { Observable } from 'rxjs';
import { ILanguageLayout, ILayout, IRow } from '../layout-schema/layout-schema.interface';
import { IPreviewTemplateSend, ITestEmailSend } from './display-condition';
import { IEmailComponentFilter } from './email-component-filter.interface';
import { IEmailComponentListItem } from './email-component-list-item.interface';
import { IEmailTemplateDetail } from './email-template-detail.interface';
import { IEmailTemplateCreateRequest } from './email-template-edit.interface';
import { IEmailTemplatePreview } from './email-template-preview.interface';
import { IEmailTypeFilter } from './email-type-filter.interface';
import { IEmailType } from './email-type.interface';
import { IEventVariable } from './event-variable.interface';
import { IFolderedImageList, IFolderedImageUpload } from './image-upload.interface';
import { IListResult } from './list-result.interface';
import { IPartnerHierarchyListItem } from './partner-hierarchy.interface';
import { ISearchParams } from './search-params.interface';

export interface IHTMLBuilderService {
  uploadImage(folder: string, image: File): Observable<IFolderedImageUpload>;
  getImageList(folder: string): Observable<IFolderedImageList>;
  getEventVariables(): Observable<IEventVariable[]>;
  getComponentList(limit: number, offset: number, isRecent?: boolean, searchForm?: IEmailComponentFilter): Observable<IListResult<IEmailComponentListItem>>;
  createComponent(name: string, content?: IRow): Observable<IEmailComponentListItem>;
  loadComponent(id: string): Observable<IRow>;
  saveComponent(id: string, name: string, json: IRow): Observable<ILayoutSaveResult>;
  loadLayout(emailTemplateId: string, layoutId: string): Observable<ILayout>;
  saveLayout(emailTemplateId: string, layoutId: string, json: ILayout, html: string): Observable<ILayoutSaveResult>;
  getLanguageLayoutList(emailTemplateId: string): Observable<ILanguageLayout[]>;
  getDefaultLanguageLayout(emailTemplateId: string): Observable<ILanguageLayout>;
  getPartnerHierarchy(): Observable<IPartnerHierarchyListItem[]>;
  getEmailTypes(searchParams?: ISearchParams, filter?: IEmailTypeFilter): Observable<IListResult<IEmailType>>;
  createEmailTemplate(data: IEmailTemplateCreateRequest): Observable<IEmailTemplateDetail>;
  getDisplayConditions(): Observable<string[]>;
  previewEmailTemplate(templateId: AAGUID, layoutId: AAGUID, displayConditions: IPreviewTemplateSend): Observable<IEmailTemplatePreview>;
  sendTestEmail(id: AAGUID, data: ITestEmailSend): Observable<ITestEmailSendResult>;
}

export interface ILayoutSaveResult {
  /**
   * True if successfully save false otherwise.
   */
  saved: boolean;

  /**
   * If `saved` is false this must contain human readable information about the error.
   */
  error?: string;
}

export interface ITestEmailSendResult {
  sent: boolean;
  error?: string;
}
