import { AAGUID } from '@interticket/core';
import { EmailTemplateStatus } from '../enums/email-template-status.enum';
import { EmailTemplateType } from '../enums/email-template-type.enum';
import { IEmailType } from './email-type.interface';

export interface IEmailTemplateListItem {
  id: AAGUID;
  name: string;
  templateType: EmailTemplateType;
  emailType: IEmailType;
  partnerIds: AAGUID[];
  regionIds: AAGUID[];
  status: EmailTemplateStatus;
  layoutId: string;
  thumbnailPath: string;
  ownerId: string;
  isDeleted?: boolean;
  migrated: boolean;
}
