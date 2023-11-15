import { AAGUID } from '@interticket/core';
import { IEmailTemplateDetail } from './email-template-detail.interface';

export interface IEmailTemplateCreateRequest extends Pick<IEmailTemplateDetail, 'name' | 'templateType' | 'partnerIds' | 'regionIds' | 'status' | 'description'> {
  emailTypeId: AAGUID;
}
