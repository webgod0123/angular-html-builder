import { InjectionToken } from '@angular/core';

export interface IEditorConfig {
  cdnBaseUrl?: string;
}

export const EDITOR_CONFIG_ACCESSOR = new InjectionToken<IEditorConfig>('EDITOR_CONFIG_ACCESSOR');
