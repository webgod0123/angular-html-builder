import { SortDirection } from '@angular/material/sort';

export interface ISearchParams {
  limit?: number;
  pageIndex?: number;
  orderBy?: string;
  order?: SortDirection;
}
