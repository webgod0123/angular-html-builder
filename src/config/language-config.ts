import { ITranslateConfig, LanguageCode } from '@interticket/core';

export const languageConfig: ITranslateConfig['language'] = {
  supported: [
    LanguageCode.EN,
    LanguageCode.HU,
  ],
  default: LanguageCode.EN,
  fallback: LanguageCode.EN,
};
