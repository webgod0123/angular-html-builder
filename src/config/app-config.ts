import { InjectionToken } from '@angular/core';
import { languageConfig } from './language-config';

export const appConfig = {
  languageConfig,
  translationTags: ['STXAdmin'],
  serviceUrl: '/api',
};

export type IAppConfig = typeof appConfig;

export const APP_CONFIG = new InjectionToken<IAppConfig>('APP_CONFIG');
