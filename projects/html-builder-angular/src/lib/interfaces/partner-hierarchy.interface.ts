import { AAGUID } from '@interticket/core';

export enum PartnerHierarchyLevel {
  PLATFORM = 'Platform',
  REGION = 'Region',
  PARTNER = 'Partner',
}

export interface IPartnerHierarchyListItem {
  parentId: AAGUID | null;
  partnerId: AAGUID;
  name: string;
  companyName: string;
  level: PartnerHierarchyLevel;
}
