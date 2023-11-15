import { Injectable } from '@angular/core';
import { AAGUID, LanguageCode } from '@interticket/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { EmailTemplateStatus } from '../enums/email-template-status.enum';
import { EmailTemplateType } from '../enums/email-template-type.enum';
import { IHTMLBuilderService, ILayoutSaveResult, ITestEmailSendResult } from '../interfaces';
import { IPreviewTemplateSend, ITestEmailSend } from '../interfaces/display-condition';
import { IEmailComponentListItem } from '../interfaces/email-component-list-item.interface';
import { IEmailTemplateDetail } from '../interfaces/email-template-detail.interface';
import { IEmailTemplateCreateRequest } from '../interfaces/email-template-edit.interface';
import { IEmailTemplatePreview } from '../interfaces/email-template-preview.interface';
import { IEmailTypeFilter } from '../interfaces/email-type-filter.interface';
import { IEmailType } from '../interfaces/email-type.interface';
import { IEventVariable } from '../interfaces/event-variable.interface';
import { IFolderedImageList, IFolderedImageUpload } from '../interfaces/image-upload.interface';
import { IListResult } from '../interfaces/list-result.interface';
import { IPartnerHierarchyListItem } from '../interfaces/partner-hierarchy.interface';
import { ISearchParams } from '../interfaces/search-params.interface';
import { exampleComponent, exampleLayout } from '../layout-schema/example-layout';
import { ILanguageLayout, ILayout, IRow } from '../layout-schema/layout-schema.interface';
import { getImageList } from '../mocks/image.mock';
import { getPartnerHierarchyMock } from '../mocks/partner.mock';

@Injectable()
export class MockHTMLBuilderService implements IHTMLBuilderService {

  getImageList(folder: string): Observable<IFolderedImageList> {
    return of({ items: getImageList(20) }).pipe(delay(300));
  }

  uploadImage(folder: string, image: File): Observable<IFolderedImageUpload> {
    return of<IFolderedImageUpload>({ folderImagePath: '200/300' });
  }

  getEventVariables(): Observable<IEventVariable[]> {
    return of<IEventVariable[]>([
      { dummyValue: 'Test', isDate: false, label: 'firstName', value: '.userDetails.firstName' },
      { dummyValue: 'Elek', isDate: false, label: 'lastName', value: '.userDetails.lastName' },
      { dummyValue: 'test.elek@intericket.com', isDate: false, label: 'email', value: '.userDetails.email' },
      { dummyValue: 'EUR', isDate: false, label: 'currency', value: '.currency' },
      { dummyValue: '10500', isDate: false, label: 'totalPrice', value: '.totalPrice' },
      { dummyValue: 'COMPANY', isDate: false, label: 'customerType', value: '.customer.customerType' },
      { dummyValue: 'Sauron', isDate: false, label: 'firstName', value: '.customer.firstName' },
      { dummyValue: 'Dark', isDate: false, label: 'lastName', value: '.customer.lastName' },
      { dummyValue: 'Warner Bros', isDate: false, label: 'companyName', value: '.customer.companyName' },
      { dummyValue: 'cd4389809cc8435bbf342c50011da0d1', isDate: false, label: 'programId', value: '$e.programID' },
      { dummyValue: '94b8c78efc234a008c8f833ba1fbdc57', isDate: false, label: 'eventId', value: '$e.eventID' },
      { dummyValue: 'Gladiator', isDate: false, label: 'eventName', value: '$e.eventName' },
      { dummyValue: 'Budapest Theater', isDate: false, label: 'venueName', value: '$e.venueName' },
      { dummyValue: 'c1d48903f0904459814dff595bdc8664', isDate: false, label: 'ticketId', value: '$t.ticketID' },
      { dummyValue: 'onsite', isDate: false, label: 'ticketType', value: '$t.ticketType' },
      { dummyValue: '2000', isDate: false, label: 'ticketPrice', value: '$t.ticketPrice' },
    ]);
  }

  getComponentList(): Observable<IListResult<IEmailComponentListItem>> {
    return of({
      results: [
        {
          id: '63d09d6d-3e5a-4624-998e-f11a942b99d0',
          name: 'Event component',
          ownerId: 'd7d4146e-4dbc-4390-9463-55e25297c437',
          thumbnailPath: 'ticket-templates/ext/thumbnails/63d09d6d-3e5a-4624-998e-f11a942b99d0.jpg',
        },
        {
          id: '63d09d6d-3e5a-4624-998e-f11a942b99d1',
          name: 'Ticket component',
          ownerId: 'd7d4146e-4dbc-4390-9463-55e25297c437',
          thumbnailPath: 'ticket-templates/ext/thumbnails/63d09d6d-3e5a-4624-998e-f11a942b99d0.jpg',
        },
        {
          id: '63d09d6d-3e5a-4624-998e-f11a942b99d0',
          name: 'Event component',
          ownerId: 'd7d4146e-4dbc-4390-9463-55e25297c437',
          thumbnailPath: 'ticket-templates/ext/thumbnails/63d09d6d-3e5a-4624-998e-f11a942b99d0.jpg',
        },
        {
          id: '63d09d6d-3e5a-4624-998e-f11a942b99d1',
          name: 'Ticket component',
          ownerId: 'd7d4146e-4dbc-4390-9463-55e25297c437',
          thumbnailPath: 'ticket-templates/ext/thumbnails/63d09d6d-3e5a-4624-998e-f11a942b99d0.jpg',
        },
      ],
      resultsLength: 4,
    });
  }

  createComponent(name: string, content?: IRow): Observable<IEmailComponentListItem> {
    return of({
      id: '63d09d6d-3e5a-4624-998e-f11a942b99d0',
      name: name,
      ownerId: 'd7d4146e-4dbc-4390-9463-55e25297c437',
      thumbnailPath: 'ticket-templates/ext/thumbnails/63d09d6d-3e5a-4624-998e-f11a942b99d0.jpg',
    });
  }

  loadComponent(id: string): Observable<IRow> {
    return of(exampleComponent);
  }

  saveComponent(id: string, name: string, json: IRow): Observable<ILayoutSaveResult> {
    return of({
      saved: true,
    });
  }

  loadLayout(emailTemplateId: string, layoutId: string): Observable<ILayout> {
    return of(exampleLayout);
  }

  saveLayout(emailTemplateId: string, layoutId: string, json: ILayout, html: string): Observable<ILayoutSaveResult> {
    return of({
      saved: true,
    });
  }

  getLanguageLayoutList(emailTemplateId: string): Observable<ILanguageLayout[]> {
    return of([
      {
        id: '63d09d6d-3e5a-4624-998e-f11a942b99d0',
        language: 'hu',
      },
      {
        id: '63d09d6d-3e5a-4624-998e-f11a942b99d1',
        language: 'en',
      },
      {
        id: '63d09d6d-3e5a-4624-998e-f11a942b99d2',
        language: 'de',
      },
    ]);
  }

  getDefaultLanguageLayout(emailTemplateId: string): Observable<ILanguageLayout> {
    return of({
      id: '63d09d6d-3e5a-4624-998e-f11a942b99d0',
      layoutHtml: '<html></html>',
      layoutJson: {},
      language: 'hu',
      imageIds: [
        'email-templates/ext/864f8005-6d3f-4424-8ed9-8f941d20edb7/864f8005-6d3f-4424-8ed9-8f941d20edb7/864f8005-6d3f-4424-8ed9-8f941d20edb7/362bd552-f378-4df6-9ed6-6312544d9659',
      ],
    });
  }

  getPartnerHierarchy(): Observable<IPartnerHierarchyListItem[]> {
    return of<IPartnerHierarchyListItem[]>(getPartnerHierarchyMock()).pipe(delay(400));
  }

  getEmailTypes(searchParams: ISearchParams, filter: IEmailTypeFilter): Observable<IListResult<IEmailType>> {
    return of<IListResult<IEmailType>>({
      results: [
        {
          description: '',
          id: '02a2ad90-b6b7-4558-8a39-d1006f979af0',
          name: 'Confirmation',
          slug: 'confirmation',
        },
      ],
      resultsLength: 1,
    });
  }

  createEmailTemplate(data: IEmailTemplateCreateRequest): Observable<IEmailTemplateDetail> {
    return of<IEmailTemplateDetail>({
      id: '63d09d6d-3e5a-4624-998e-f11a942b99d0',
      name: '2022-11-04',
      templateType: EmailTemplateType.MASTER,
      emailType: {
        name: 'Confirmation Email',
        id: '864f8005-6d3f-4424-8ed9-8f941d20edb8',
      },
      status: EmailTemplateStatus.INACTIVE,
      ownerId: 'd7d4146e-4dbc-4390-9463-55e25297c437',
      partnerIds: ['4607ec5f-ed75-4d44-bf74-cf85591ed375'],
      layoutId: '81bf228c-214b-44b9-bf75-d5e3bb49655g',
      regionIds: ['802eb3c1-d1e3-4f76-8b08-a6b5aee41832'],
      thumbnailPath: 'ticket-templates/ext/thumbnails/63d09d6d-3e5a-4624-998e-f11a942b99d0.jpg',
      description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
      layouts: [
        {
          id: '63d09d6d-3e5a-4624-998e-f11a942b99d0',
          language: LanguageCode.EN,
          updatedAt: '2022-11-12T08:57:30.263498Z',
          createdAt: '2022-11-04T06:39:30.350475Z',
        },
      ],
      migrated: false,
    });
  }

  getDisplayConditions(): Observable<string[]> {
    return of<string[]>([
      'Normal',
      'Livestream',
      'Video',
      'LivestreamVideo',
      'Cards',
    ]);
  }

  previewEmailTemplate(templateId: string, layoutId: string, displayConditions: IPreviewTemplateSend): Observable<IEmailTemplatePreview> {
    return of<IEmailTemplatePreview>({ layoutHtml: "\u003chtml xmlns=\"http://www.w3.org/1999/xhtml\"\u003e\n\u003chead\u003e\n    \u003cmeta content=\"text/html; charset=utf-8\" http-equiv=\"Content-Type\"\u003e\n    \u003cmeta content=\"width=device-width, initial-scale=1.0\" name=\"viewport\"\u003e\n    \u003clink href=\"https://fonts.googleapis.com/css?family=Open+Sans\" rel=\"stylesheet\"\u003e\n\n    \u003cstyle type=\"text/css\"\u003e\n        body {\n            width: 100% !important;\n            -webkit-text-size-adjust: 100%;\n            -ms-text-size-adjust: 100%;\n            margin: 0;\n            padding: 0;\n        }\n    \u003c/style\u003e\n\u003c/head\u003e\n\u003cbody\u003e\n\u003ctable cellpadding=\"0\" cellspacing=\"0\" border=\"0\"\u003e\u003ctr\u003e\u003ctd\u003e\n      \u003cstyle\u003e\n        table[data-id='b77817e9-8ce0-4b03-a3f0-4d18beafaea8'] a{color:#3aaee0;text-decoration:inherit;}\n      \u003c/style\u003e\u003c/td\u003e\u003ctd\u003e\u003cstyle\u003e\n        table[data-id='b77817e9-8ce0-4b03-a3f0-4d18beafaea8'] p {margin: 0 !important;padding: 0 !important;}\n      \u003c/style\u003e\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e\u003ctable cellpadding=\"0\" cellspacing=\"0\" border=\"0\" class=\"builder-body\" data-id=\"b77817e9-8ce0-4b03-a3f0-4d18beafaea8\" style=\"width: 100%; color: rgb(255, 0, 0); background: rgba(91, 213, 233, 0.38); font-family: Arial;\"\u003e\u003ctr\u003e\u003ctd style=\"vertical-align: top;\"\u003e\u003crender-email-display-conditions _nghost-mhe-c575=\"\"\u003e\u003ctable cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width: 100%; background: rgba(255, 255, 255, 0); padding: 0px;\"\u003e\u003ctr\u003e\u003ctd\u003e\u003ctable cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width: 600px; margin: 0px auto; background-size: initial; background-repeat: no-repeat; background-attachment: initial; background-origin: initial; background-clip: initial; background-color: rgb(255, 255, 255);\"\u003e\u003ctr\u003e\u003ctd style=\"display: flex;\"\u003e\u003ctable cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width: 100%; background: rgba(255, 255, 255, 0); padding: 0px; border-width: 0px; border-style: solid; border-color: rgba(255, 255, 255, 0);\"\u003e\u003ctr style=\"width: 100%;\"\u003e\u003ctd style=\"width: 100%; display: block;\"\u003e\u003ctable cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width: 100%;\"\u003e\u003ctr\u003e\u003ctd\u003e\u003cng-contaier ng-reflect-ng-switch=\"menu\"\u003e\u003ctable cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width: 100%; font-size: 14px; font-family: Arial; line-height: 140%; text-align: center; padding: 10px;\"\u003e\u003ctr\u003e\u003ctd\u003e\u003ca href=\"https://ext.stx.interticket.com/\" target=\"_blank\" style=\"color: rgb(0, 0, 0); display: inline-block; padding: 10px;\"\u003eMenu1\u003c/a\u003e\u003cspan\u003e/\u003c/span\u003e\u003cspan style=\"color: rgb(0, 0, 0); display: inline-block; padding: 10px;\"\u003eMenu2\u003c/span\u003e\u003cspan\u003e/\u003c/span\u003e\u003cspan style=\"color: rgb(0, 0, 0); display: inline-block; padding: 10px;\"\u003eMenu3\u003c/span\u003e\u003cspan\u003e/\u003c/span\u003e\u003cspan style=\"color: rgb(0, 0, 0); display: inline-block; padding: 10px;\"\u003eMenu4\u003c/span\u003e\u003cspan\u003e/\u003c/span\u003e\u003cspan style=\"color: rgb(0, 0, 0); display: inline-block; padding: 10px;\"\u003eMenu5\u003c/span\u003e\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e\u003c/ng-contaier\u003e\u003cng-contaier ng-reflect-ng-switch=\"head\"\u003e\u003ctable cellpadding=\"0\" cellspacing=\"0\" border=\"0\"\u003e\u003ctr\u003e\u003ctd\u003e\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e\u003ctable cellpadding=\"0\" cellspacing=\"0\" border=\"0\" data-id=\"bc09500d-c98f-4470-b2a5-f926e460784c\" style=\"width: 100%; font-family: Arial; font-size: 32px; color: rgb(0, 0, 0); text-align: left; line-height: 140%; padding: 10px;\"\u003e\u003ctr\u003e\u003ctd\u003e\u003cp\u003eHeading\u003c/p\u003e\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e\u003c/ng-contaier\u003e\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e\u003c/render-email-display-conditions\u003e\u003crender-email-display-conditions _nghost-mhe-c575=\"\"\u003e\u003ctable cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width: 100%; background: rgba(255, 255, 255, 0); padding: 0px;\"\u003e\u003ctr\u003e\u003ctd\u003e\u003ctable cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width: 600px; margin: 0px auto; background: url(\u0026quot;https://cdn.stx.interticket.com/email-templates/ext/864f8005-6d3f-4424-8ed9-8f941d20edb7/864f8005-6d3f-4424-8ed9-8f941d20edb7/864f8005-6d3f-4424-8ed9-8f941d20edb7/4b568dd9-7aab-47b2-8c84-3564200f09e9\u0026quot;) center center no-repeat rgba(255, 255, 255, 0);\"\u003e\u003ctr\u003e\u003ctd style=\"display: flex;\"\u003e\u003ctable cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width: 100%; background: rgba(255, 255, 255, 0); padding: 0px; border-width: 0px; border-style: solid; border-color: rgba(255, 255, 255, 0);\"\u003e\u003ctr style=\"width: 100%;\"\u003e\u003ctd style=\"width: 100%; display: block;\"\u003e\u003ctable cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width: 100%;\"\u003e\u003ctr\u003e\u003ctd\u003e\u003cng-contaier ng-reflect-ng-switch=\"button\"\u003e\u003crender-email-display-conditions _nghost-mhe-c575=\"\"\u003e\u003ctable style=\"text-align: center; width: 100%; padding: 100px;\"\u003e\u003ctr\u003e\u003ctd\u003e\u003ca href=\"\" target=\"_blank\" style=\"width: auto; padding: 10px; background-color: rgb(226, 11, 163); border-radius: 10px; display: inline-block; color: rgb(234, 14, 14); font-family: Arial; line-height: 140%; font-size: 14px; text-align: center;\"\u003e\u003cp\u003eTest IM Click\u003c/p\u003e\u003c/a\u003e\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e\u003c/render-email-display-conditions\u003e\u003c/ng-contaier\u003e\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e\u003c/render-email-display-conditions\u003e\u003crender-email-display-conditions _nghost-mhe-c575=\"\"\u003e\u003ctable cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width: 100%; background: rgba(255, 255, 255, 0); padding: 0px;\"\u003e\u003ctr\u003e\u003ctd\u003e\u003ctable cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width: 600px; margin: 0px auto; background-size: initial; background-repeat: no-repeat; background-attachment: initial; background-origin: initial; background-clip: initial; background-color: rgb(255, 255, 255);\"\u003e\u003ctr\u003e\u003ctd style=\"display: flex;\"\u003e\u003ctable cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width: 100%; background: rgba(255, 255, 255, 0); padding: 0px; border-width: 0px; border-style: solid; border-color: rgba(255, 255, 255, 0);\"\u003e\u003ctr style=\"width: 100%;\"\u003e\u003ctd style=\"width: 100%; display: block;\"\u003e\u003ctable cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width: 100%;\"\u003e\u003ctr\u003e\u003ctd\u003e\u003cng-contaier ng-reflect-ng-switch=\"button\"\u003e\u003crender-email-display-conditions _nghost-mhe-c575=\"\"\u003e\u003ctable style=\"text-align: center; width: 100%; padding: 10px;\"\u003e\u003ctr\u003e\u003ctd\u003e\u003ca href=\"https://angular.io/tutorial\" target=\"_blank\" style=\"width: auto; padding: 10px; background-color: rgb(58, 174, 224); border-radius: 10px; display: inline-block; color: rgb(255, 255, 255); font-family: Arial; line-height: 140%; font-size: 14px; text-align: center;\"\u003e\u003cp\u003eGo to angular tutorial\u003c/p\u003e\u003c/a\u003e\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e\u003c/render-email-display-conditions\u003e\u003c/ng-contaier\u003e\u003cng-contaier ng-reflect-ng-switch=\"image\"\u003e\u003crender-email-display-conditions _nghost-mhe-c575=\"\"\u003e\u003ctable style=\"text-align: left; width: 100%;\"\u003e\u003ctr\u003e\u003ctd\u003e\u003cimg src=\"https://cdn.stx.interticket.com/email-templates/ext/864f8005-6d3f-4424-8ed9-8f941d20edb7/864f8005-6d3f-4424-8ed9-8f941d20edb7/864f8005-6d3f-4424-8ed9-8f941d20edb7/379cf3f3-ffa0-4ae2-ae20-b857c15629e1\" alt=\"\" style=\"width: 100%; padding: 10px;\"\u003e\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e\u003c/render-email-display-conditions\u003e\u003c/ng-contaier\u003e\u003cng-contaier ng-reflect-ng-switch=\"html\"\u003e\u003ctable cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width: 100%; padding: 10px;\"\u003e\u003ctr\u003e\u003ctd\u003e\u003cdiv style=\"overflow-x:auto;padding-left:25px;padding-right:25px;padding-top:25px;\"\u003e\n  \u003ctable style=\"width:100%;border-collapse:collapse;border-spacing:0;border-style:solid;border-color:#ddd;border-width:1px\"\u003e\n    \u003ctbody\u003e\u003ctr style=\"background-color:#404040;color:white;font-weight:bold;\"\u003e\n      \u003cth style=\"padding:4px;text-align:left;\"\u003eComponent name\u003c/th\u003e\n      \u003cth style=\"padding:4px;text-align:left;\"\u003eOld version\u003c/th\u003e\n      \u003cth style=\"padding:4px;text-align:left;\"\u003eNew version\u003c/th\u003e\n    \u003c/tr\u003e\n    \u003ctr style=\"background-color:#404040;font-weight:bold;\"\u003e\n      \u003ctd style=\"padding:4px;text-align:left;color:#e42686;\"\u003eGoogle Kubernetes Engine\u003c/td\u003e\n      \u003ctd style=\"padding:4px;text-align:left;color:white;\"\u003ex.xxx.xx\u003c/td\u003e\n      \u003ctd style=\"padding:4px;text-align:left;color:white;\"\u003ez.zzz.zz\u003c/td\u003e\n    \u003c/tr\u003e\n    \u003ctr style=\"background-color:#E7E6E6;font-weight:bold;\"\u003e\n      \u003ctd colspan=\"3\" style=\"padding:4px;text-align:left;\"\u003eRelease Note(s)\u003c/td\u003e\n    \u003c/tr\u003e\n    \u003ctr\u003e\n      \u003ctd colspan=\"3\" style=\"padding:4px;text-align:left;\"\u003e\u003ca href=\"\"\u003e\u003c/a\u003e\u003c/td\u003e\n    \u003c/tr\u003e\n    \u003ctr style=\"background-color:#E7E6E6;font-weight:bold;\"\u003e\n      \u003ctd colspan=\"3\" style=\"padding:4px;\"\u003eExpert summary\u003c/td\u003e\n    \u003c/tr\u003e\n    \u003ctr\u003e\n      \u003ctd colspan=\"3\" style=\"padding:4px;text-align:left;\"\u003e\u003c/td\u003e\n    \u003c/tr\u003e\n    \u003ctr style=\"background-color:#E7E6E6;font-weight:bold;\"\u003e\n      \u003ctd colspan=\"3\" style=\"padding:4px;\"\u003eDeadline\u003c/td\u003e\n    \u003c/tr\u003e\n    \u003ctr\u003e\n      \u003ctd colspan=\"3\" style=\"padding:4px;text-align:left;\"\u003e\u003c/td\u003e\n    \u003c/tr\u003e\n    \u003ctr style=\"background-color:#E7E6E6;font-weight:bold;\"\u003e\n      \u003ctd colspan=\"3\" style=\"padding:4px\"\u003eScheduled time of updating\u003c/td\u003e\n    \u003c/tr\u003e\n    \u003ctr style=\"background-color:#E7E6E6;font-weight:bold;\"\u003e\n      \u003ctd style=\"padding:4px;text-align:left;\"\u003eEnvironment\u003c/td\u003e\n      \u003ctd style=\"padding:4px;text-align:left;\"\u003eWill it be updated?\u003c/td\u003e\n      \u003ctd style=\"padding:4px;text-align:left;\"\u003eScheduled date and time\u003c/td\u003e\n    \u003c/tr\u003e\n    \u003ctr\u003e\n      \u003ctd style=\"padding:4px;text-align:left;\"\u003edev\u003c/td\u003e\n      \u003ctd style=\"padding:4px;text-align:left;\"\u003e\u003cspan style=\"color:#70AD47;font-weight:bold;\"\u003e✓\u003c/span\u003e\u003cspan style=\"color:#C00000;font-weight:bold;\"\u003e✗\u003c/span\u003e\u003c/td\u003e\n      \u003ctd style=\"padding:4px;text-align:left;\"\u003e\u003c/td\u003e\n    \u003c/tr\u003e\u003ctr\u003e\n      \u003ctd style=\"padding:4px;text-align:left;\"\u003eqa\u003c/td\u003e\n    \u003ctd style=\"padding:4px;text-align:left;\"\u003e\u003cspan style=\"color:#70AD47;font-weight:bold;\"\u003e✓\u003c/span\u003e\u003cspan style=\"color:#C00000;font-weight:bold;\"\u003e✗\u003c/span\u003e\u003c/td\u003e\n      \u003ctd style=\"padding:4px;text-align:left;\"\u003e\u003c/td\u003e\n    \u003c/tr\u003e\n    \u003ctr\u003e\n      \u003ctd style=\"padding:4px;text-align:left;\"\u003eext\u003c/td\u003e\n      \u003ctd style=\"padding:4px;text-align:left;\"\u003e\u003cspan style=\"color:#70AD47;font-weight:bold;\"\u003e✓\u003c/span\u003e\u003cspan style=\"color:#C00000;font-weight:bold;\"\u003e✗\u003c/span\u003e\u003c/td\u003e\n      \u003ctd style=\"padding:4px;text-align:left;\"\u003e\u003c/td\u003e\n    \u003c/tr\u003e\n    \u003ctr\u003e\n      \u003ctd style=\"padding:4px;text-align:left;\"\u003eext2\u003c/td\u003e\n      \u003ctd style=\"padding:4px;text-align:left;\"\u003e\u003cspan style=\"color:#70AD47;font-weight:bold;\"\u003e✓\u003c/span\u003e\u003cspan style=\"color:#C00000;font-weight:bold;\"\u003e✗\u003c/span\u003e\u003c/td\u003e\n      \u003ctd style=\"padding:4px;text-align:left;\"\u003e\u003c/td\u003e\n    \u003c/tr\u003e\n    \u003ctr\u003e\n      \u003ctd style=\"padding:4px;text-align:left;\"\u003eprodlike\u003c/td\u003e\n      \u003ctd style=\"padding:4px;text-align:left;\"\u003e\u003cspan style=\"color:#70AD47;font-weight:bold;\"\u003e✓\u003c/span\u003e\u003cspan style=\"color:#C00000;font-weight:bold;\"\u003e✗\u003c/span\u003e\u003c/td\u003e\n      \u003ctd style=\"padding:4px;text-align:left;\"\u003e\u003c/td\u003e\n    \u003c/tr\u003e\n    \u003ctr\u003e\n      \u003ctd style=\"padding:4px;text-align:left;\"\u003eprod\u003c/td\u003e\n      \u003ctd style=\"padding:4px;text-align:left;\"\u003e\u003cspan style=\"color:#70AD47;font-weight:bold;\"\u003e✓\u003c/span\u003e\u003cspan style=\"color:#C00000;font-weight:bold;\"\u003e✗\u003c/span\u003e\u003c/td\u003e\n      \u003ctd style=\"padding:4px;text-align:left;\"\u003e\u003c/td\u003e\n    \u003c/tr\u003e\n  \u003c/tbody\u003e\u003c/table\u003e\n\u003c/div\u003e\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e\u003c/ng-contaier\u003e\u003cng-contaier ng-reflect-ng-switch=\"image\"\u003e\u003crender-email-display-conditions _nghost-mhe-c575=\"\"\u003e\u003ctable style=\"text-align: left; width: 100%;\"\u003e\u003ctr\u003e\u003ctd\u003e\u003cimg src=\"https://cdn.stx.interticket.com/email-templates/ext/864f8005-6d3f-4424-8ed9-8f941d20edb7/864f8005-6d3f-4424-8ed9-8f941d20edb7/864f8005-6d3f-4424-8ed9-8f941d20edb7/bb47cfff-137c-46b5-b28e-405c2d0518a3\" alt=\"\" style=\"width: 100%; padding: 10px;\"\u003e\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e\u003c/render-email-display-conditions\u003e\u003c/ng-contaier\u003e\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e\u003c/render-email-display-conditions\u003e\u003crender-email-display-conditions _nghost-mhe-c575=\"\"\u003e\u003ctable cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width: 100%;\"\u003e\u003ctr\u003e\u003ctd\u003e\u003ctable cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width: 600px; margin: 0px auto;\"\u003e\u003ctr\u003e\u003ctd style=\"display: flex;\"\u003e\u003ctable cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width: 100%;\"\u003e\u003ctr style=\"width: 100%;\"\u003e\u003ctd style=\"width: 100%; display: block;\"\u003e\u003ctable cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width: 100%;\"\u003e\u003ctr\u003e\u003ctd\u003e\u003cng-contaier ng-reflect-ng-switch=\"variable\"\u003e\u003crender-email-display-conditions _nghost-mhe-c575=\"\"\u003e\u003ctable cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width: 100%; font-size: 14px; line-height: 140%; text-align: left; color: rgb(0, 0, 0);\"\u003e\u003ctr\u003e\u003ctd\u003e\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e\u003c/render-email-display-conditions\u003e\u003c/ng-contaier\u003e\u003cng-contaier ng-reflect-ng-switch=\"divider\"\u003e\u003crender-email-display-conditions _nghost-mhe-c575=\"\"\u003e\u003ctable cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width: 100%; text-align: left; line-height: 0;\"\u003e\u003ctr\u003e\u003ctd style=\"display: inline-block; width: 100%; padding: 10px; border-top: 1px solid rgb(0, 0, 0);\"\u003e\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e\u003c/render-email-display-conditions\u003e\u003c/ng-contaier\u003e\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e\u003c/render-email-display-conditions\u003e\u003crender-email-display-conditions _nghost-mhe-c575=\"\"\u003e\u003ctable cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width: 100%;\"\u003e\u003ctr\u003e\u003ctd\u003e\u003ctable cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width: 600px; margin: 0px auto;\"\u003e\u003ctr\u003e\u003ctd style=\"display: flex;\"\u003e\u003ctable cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width: 100%;\"\u003e\u003ctr style=\"width: 100%;\"\u003e\u003ctd style=\"width: 100%; display: block;\"\u003e\u003ctable cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width: 100%;\"\u003e\u003ctr\u003e\u003ctd\u003e\u003cng-contaier ng-reflect-ng-switch=\"variable\"\u003e\u003crender-email-display-conditions _nghost-mhe-c575=\"\"\u003e\u003ctable cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width: 100%; font-size: 14px; line-height: 140%; text-align: left; color: rgb(0, 0, 0);\"\u003e\u003ctr\u003e\u003ctd\u003eSauron\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e\u003c/render-email-display-conditions\u003e\u003c/ng-contaier\u003e\u003cng-contaier ng-reflect-ng-switch=\"variable\"\u003e\u003crender-email-display-conditions _nghost-mhe-c575=\"\"\u003e\u003ctable cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width: 100%; font-size: 14px; line-height: 140%; text-align: left; color: rgb(0, 0, 0);\"\u003e\u003ctr\u003e\u003ctd\u003e\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e\u003c/render-email-display-conditions\u003e\u003c/ng-contaier\u003e\u003cng-contaier ng-reflect-ng-switch=\"variable\"\u003e\u003crender-email-display-conditions _nghost-mhe-c575=\"\"\u003e\u003ctable cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width: 100%; font-size: 14px; line-height: 140%; text-align: left; color: rgb(0, 0, 0);\"\u003e\u003ctr\u003e\u003ctd\u003e\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e\u003c/render-email-display-conditions\u003e\u003c/ng-contaier\u003e\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e\u003c/render-email-display-conditions\u003e\u003crender-email-display-conditions _nghost-mhe-c575=\"\"\u003e\u003ctable cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width: 100%;\"\u003e\u003ctr\u003e\u003ctd\u003e\u003ctable cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width: 600px; margin: 0px auto;\"\u003e\u003ctr\u003e\u003ctd style=\"display: flex;\"\u003e\u003ctable cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width: 100%;\"\u003e\u003ctr style=\"width: 100%;\"\u003e\u003ctd style=\"width: 100%; display: block;\"\u003e\u003ctable cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width: 100%;\"\u003e\u003ctr\u003e\u003ctd\u003e\u003cng-contaier ng-reflect-ng-switch=\"text\"\u003e\u003crender-email-display-conditions _nghost-mhe-c575=\"\"\u003e\u003ctable cellpadding=\"0\" cellspacing=\"0\" border=\"0\"\u003e\u003ctr\u003e\u003ctd\u003e\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e\u003ctable cellpadding=\"0\" cellspacing=\"0\" border=\"0\" data-id=\"f62c57d7-27b6-439e-a22a-21dca5192078\" style=\"width: 100%; font-family: Arial; font-size: 14px; line-height: 140%; text-align: left; color: rgb(154, 253, 36); padding: 10px;\"\u003e\u003ctr\u003e\u003ctd\u003e\u003cp\u003etest im http://knTyIfS.org/gRIexNr.php\u003c/p\u003e\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e\u003c/render-email-display-conditions\u003e\u003c/ng-contaier\u003e\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e\u003c/render-email-display-conditions\u003e\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e\n\u003c/body\u003e\n\u003c/html\u003e" });
  }

  sendTestEmail(id: AAGUID, data: ITestEmailSend): Observable<ITestEmailSendResult> {
    return of<ITestEmailSendResult>({
      sent: true,
    });
  }

}
