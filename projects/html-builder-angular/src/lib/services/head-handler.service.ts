import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IHeadValue } from '../layout-schema/layout-schema.interface';

@Injectable()
export class HeadHandlerService {

  private activeValues = new BehaviorSubject<IHeadValue | null>(null);
  public activeValues$ = this.activeValues.asObservable();

  setCurrentValues(values: IHeadValue): void {
    this.activeValues.next(values);
  }

}
