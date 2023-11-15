import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IDividerValues } from '../layout-schema/layout-schema.interface';

@Injectable()
export class DividerHandlerService {

  private activeValues = new BehaviorSubject<IDividerValues | null>(null);
  public activeValues$ = this.activeValues.asObservable();

  setCurrentValues(values: IDividerValues): void {
    this.activeValues.next(values);
  }

}
