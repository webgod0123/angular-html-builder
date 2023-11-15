import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IHtmlValue } from '../layout-schema/layout-schema.interface';

@Injectable()
export class HtmlHandlerService {

  private activeValues = new BehaviorSubject<IHtmlValue | null>(null);
  public activeValues$ = this.activeValues.asObservable();

  setCurrentValues(values: IHtmlValue): void {
    this.activeValues.next(values);
  }

}
