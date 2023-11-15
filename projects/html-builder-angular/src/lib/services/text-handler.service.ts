import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ITextValue } from '../layout-schema/layout-schema.interface';

@Injectable()
export class TextHandlerService {

  private activeValues = new BehaviorSubject<ITextValue | null>(null);
  public activeValues$ = this.activeValues.asObservable();

  setCurrentValues(values: ITextValue): void {
    this.activeValues.next(values);
  }

}
