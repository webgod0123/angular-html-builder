import { Component } from '@angular/core';
import { IRow } from '../../../../interfaces';
import { ContentComponentType } from '../../../../enums';

@Component({
  selector: 'columns-list',
  templateUrl: './columns-list.component.html',
  styleUrls: ['./columns-list.component.scss'],
})
export class ColumnsListComponent {

  readonly ContentComponentType = ContentComponentType;

  rows: IRow[] = [
    { name: 'row1', cols: 1, cells: [1] },
    { name: 'row2', cols: 2, cells: [1, 1] },
    { name: 'row3', cols: 3, cells: [1, 1, 1] },
    { name: 'row4', cols: 4, cells: [1, 1, 1, 1] },
    { name: 'row5', cols: 3, cells: [1, 2] },
    { name: 'row6', cols: 3, cells: [2, 1] },
    { name: 'row7', cols: 6, cells: [1, 2, 1, 2] },
    { name: 'row8', cols: 6, cells: [2, 1, 2, 1] },
  ];

}
