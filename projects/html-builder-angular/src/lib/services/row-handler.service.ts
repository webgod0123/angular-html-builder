import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IRow } from '../layout-schema/layout-schema.interface';

@Injectable()
export class RowHandlerService {

  private activeRow = new BehaviorSubject<IRow | null>(null);
  public activeRow$ = this.activeRow.asObservable();

  setCurrentRow(row: IRow): void {
    this.activeRow.next(row);
  }

}
