import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IBodyValues } from '../layout-schema/layout-schema.interface';

@Injectable()
export class BodyHandlerService {

  private activeValues = new BehaviorSubject<IBodyValues | null>(null);
  public activeValues$ = this.activeValues.asObservable();

  setCurrentValues(values: IBodyValues): void {
    this.activeValues.next(values);
  }

}
