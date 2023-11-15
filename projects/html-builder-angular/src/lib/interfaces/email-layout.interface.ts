import { AAGUID, ISODateTime, LanguageCode } from '@interticket/core';

export interface IEmailLayout {
  id?: AAGUID;
  language: LanguageCode;
  updatedAt?: ISODateTime,
  createdAt?: ISODateTime,
}
