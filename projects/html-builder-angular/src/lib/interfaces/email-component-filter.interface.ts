import { EmailComponentOwner } from '../enums/email-component-owner';
import { EmailComponentStatus } from '../enums/email-component-status';

export interface IEmailComponentFilter {
  name?: string;
  status?: EmailComponentStatus;
  owner?: EmailComponentOwner
}
