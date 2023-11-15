import { AAGUID } from '@interticket/core';

export interface IEmailComponentListItem {
  id: AAGUID;
  name: string;
  ownerId: string;
  thumbnailPath: string;
  isDeleted?: boolean
}
