import { IEmailLayout } from './email-layout.interface';
import { IEmailTemplateListItem } from './email-template-list-item.interface';

export interface IEmailTemplateDetail extends IEmailTemplateListItem {
  description: string;
  layouts?: IEmailLayout[];
}
