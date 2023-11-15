import { DndDropEvent } from 'ngx-drag-drop';

export interface IColumn {
  event: DndDropEvent;
  columnId: number;
}

export type IRowCols = number[];

export interface IRow {
  name: string,
  cells: IRowCols,
  cols: number
}
