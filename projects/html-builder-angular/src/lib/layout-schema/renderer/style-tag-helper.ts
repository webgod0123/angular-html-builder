export const getStyleTag = (
  selectorTag: 'div' | 'table',
  id: string,
  inheritBodyStyles: boolean | undefined,
  linkColor: string | undefined,
  underline: boolean | undefined
): string => {
  if (inheritBodyStyles || linkColor === undefined || underline === undefined) {
    return '';
  } else {
    return `
      <style>
        ${selectorTag}[data-id='${id}'] a{color:${linkColor};text-decoration:${underline ? 'underline' : 'inherit'};}
      </style>`;
  }
};
