import { IPartnerHierarchyListItem, PartnerHierarchyLevel } from '../interfaces/partner-hierarchy.interface';

export const getPartnerHierarchyMock = () => <IPartnerHierarchyListItem[]>[
  {
    parentId: null,
    partnerId: '864f8005-6d3f-4424-8ed9-8f941d20edb7',
    name: 'Interticket',
    companyName: 'Interticket',
    level: PartnerHierarchyLevel.PLATFORM,
  },
  {
    parentId: '864f8005-6d3f-4424-8ed9-8f941d20edb7',
    partnerId: '61900a05-0510-4aa3-9083-b98fe1d00645',
    name: 'External USA Region',
    companyName: 'External USA',
    level: PartnerHierarchyLevel.REGION,
  },
  {
    parentId: '61900a05-0510-4aa3-9083-b98fe1d00645',
    partnerId: '4dc84a34-ed07-4dac-8322-9b86fb777f7d',
    name: 'External USA Partner',
    companyName: 'Anim dolor perspicia',
    level: PartnerHierarchyLevel.PARTNER,
  },
  {
    parentId: '864f8005-6d3f-4424-8ed9-8f941d20edb7',
    partnerId: 'f880fab7-404d-4880-ba79-c60caf3000c4',
    name: 'External Test Region',
    companyName: 'External test',
    level: PartnerHierarchyLevel.REGION,
  },
  {
    parentId: '864f8005-6d3f-4424-8ed9-8f941d20edb7',
    partnerId: '802eb3c1-d1e3-4f76-8b08-a6b5aee41832',
    name: 'SmartCity Region Partner 1',
    companyName: 'Interticket',
    level: PartnerHierarchyLevel.REGION,
  },
  {
    parentId: '802eb3c1-d1e3-4f76-8b08-a6b5aee41832',
    partnerId: '4607ec5f-ed75-4d44-bf74-cf85591ed375',
    name: 'Ext Test Partner',
    companyName: 't',
    level: PartnerHierarchyLevel.PARTNER,
  },
  {
    parentId: '864f8005-6d3f-4424-8ed9-8f941d20edb7',
    partnerId: 'e6be0f27-00a7-4c16-acc5-6ed9a246a733',
    name: 'Smartcity Region Partner 2',
    companyName: 't',
    level: PartnerHierarchyLevel.REGION,
  },
  {
    parentId: '802eb3c1-d1e3-4f76-8b08-a6b5aee41832',
    partnerId: '2932c906-19ac-4e8c-8236-f7ed540c6e82',
    name: 'Translation Test SC-Partner 1',
    companyName: 'Translation Test SC-Partner 1',
    level: PartnerHierarchyLevel.PARTNER,
  },
  {
    parentId: '802eb3c1-d1e3-4f76-8b08-a6b5aee41832',
    partnerId: 'd3249c7a-a2e9-4e7a-acb2-08f2fee8cc56',
    name: 'Translation Test Partner 2',
    companyName: 'Translation Test Partner 2',
    level: PartnerHierarchyLevel.PARTNER,
  },
];
