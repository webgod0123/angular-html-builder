import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IButtonValue } from '../layout-schema/layout-schema.interface';

@Injectable()
export class ButtonHandlerService {

  private activeValues = new BehaviorSubject<IButtonValue | null>(null);
  public activeValues$ = this.activeValues.asObservable();

  setCurrentValues(values: IButtonValue): void {
    this.activeValues.next(values);
  }

}
