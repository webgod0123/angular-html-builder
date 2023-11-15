import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IImageValue } from '../layout-schema/layout-schema.interface';

@Injectable()
export class ImageHandlerService {

  private activeValues = new BehaviorSubject<IImageValue | null>(null);
  public activeValues$ = this.activeValues.asObservable();

  setCurrentValues(values: IImageValue): void {
    this.activeValues.next(values);
  }

}
