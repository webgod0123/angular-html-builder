import { Orientation } from '../enums/orientation.enum.ts';

export type Style = Record<string, string>;

export function rgbToHex(rgb?: string | null) {
  if (!rgb) {
    return '';
  }

  const [r, g, b] = rgb.replace(/[^\d,]/g, '').split(',').map(i => Number.parseInt(i).toString(16).padStart(2, '0'));

  return `#${r}${g}${b}`;
}

export function getOrientation(element: HTMLElement | SVGElement) {
  const width = Number.parseInt(element.style.width);
  const height = Number.parseInt(element.style.height);

  return width > height ? Orientation.LANDSCAPE : Orientation.PORTRAIT;
}

export function isLandscape(element: HTMLElement | SVGElement) {
  return getOrientation(element) === Orientation.LANDSCAPE;
}

export function isPortrait(element: HTMLElement | SVGElement) {
  return getOrientation(element) === Orientation.PORTRAIT;
}

export function toInteger(value?: string | number | null, defaultValue = 0) {
  if (!value) {
    return 0;
  }

  if (typeof value === 'number') {
    return value;
  }

  const result = Number.parseInt(value);

  if (Number.isNaN(result)) {
    return defaultValue;
  }

  return result;
}

export function toFloat(value?: string | number | null) {
  if (!value) {
    return 0;
  }

  if (typeof value === 'number') {
    return value;
  }

  return Number.parseFloat(value);
}
