import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IVariableValue } from '../layout-schema/layout-schema.interface';

@Injectable()
export class VariablesHandlerService {

  private activeValues = new BehaviorSubject<IVariableValue | null>(null);
  public activeValues$ = this.activeValues.asObservable();

  setCurrentValues(values: IVariableValue): void {
    this.activeValues.next(values);
  }

}
