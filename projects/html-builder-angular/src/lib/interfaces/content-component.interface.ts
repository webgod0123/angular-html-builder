import { EffectAllowed } from 'ngx-drag-drop';
import { ContentComponentType } from '../enums';

export interface IContentComponent {
  data?: string;
  title: string;
  effectAllowed?: EffectAllowed;
  disable?: boolean;
  icon: string;
  tooltip: string;
  type: ContentComponentType;
}
