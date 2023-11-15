import { IBackgroundRepeat } from '../interfaces/background-repeat.interface';

export const config = {};

export const IMAGE_FOLDER = 'email-templates';

export const FONT_FAMILY_LIST = [
  { name: 'Arial', value: 'Arial' },
  { name: 'Roboto', value: 'Roboto' },
];

export const FONT_WEIGHT_LIST = [
  { name: 'Regular', value: 'Regular' },
  { name: 'Bold', value: 'Bold' },
];

export const BACKGROUND_IMAGE_REPEAT_LIST: IBackgroundRepeat[] = [
  { name: 'None', value: 'no-repeat', icon: 'close' },
  { name: 'Repeat', value: 'repeat', icon: 'apps' },
  { name: 'Horizontal', value: 'repeat-x', icon: 'more_horiz' },
  { name: 'Vertical', value: 'repeat-y', icon: 'more_vert' },
];

export const INIT_LOAD_COUNT = 10;
export const PAGINATION_SIZE = 20;

export const LANGUAGE_NAMES = {
  en: 'English',
  hu: 'Hungarian',
  de: 'German',
};
