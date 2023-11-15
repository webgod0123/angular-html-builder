import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IMenuValue } from '../layout-schema/layout-schema.interface';

@Injectable()
export class MenuHandlerService {

  private activeValues = new BehaviorSubject<IMenuValue | null>(null);
  public activeValues$ = this.activeValues.asObservable();

  setCurrentValues(values: IMenuValue): void {
    this.activeValues.next(values);
  }

}
