import { IColumn } from '../layout-schema.interface';

/**
 * It calculates the width percent for a given column knowing all columns.
 * @param currentColumn
 * @param allColumns
 */
export const calculateWidthPercent = (currentColumn: IColumn, allColumns: IColumn[]): string => {
  const ratio = currentColumn.width / getTotalWidth(allColumns);
  return `${ratio * 100}%`;
};

function getTotalWidth(columns: IColumn[]): number {
  let sum = 0;
  columns.forEach(column => sum += column.width);
  return sum;
}
