import { AAGUID } from '@interticket/core';

export interface IEmailType {
  id: AAGUID;
  name: string;
  slug?: string,
  description?: string,
}
