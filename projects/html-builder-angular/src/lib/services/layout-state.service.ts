import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ILayout } from '../layout-schema/layout-schema.interface';

@Injectable()
export class LayoutStateService {

  /**
   * Stores the actual edited layout JSON data.
   * Every time a change is made, a new value is added to this in an immutable way.
   */
  private layoutJson = new BehaviorSubject<ILayout | null>(null);
  public layoutJson$ = this.layoutJson.asObservable();

  addNewLayoutVersion(layout: ILayout): void {
    this.layoutJson.next(layout);
  }

  getCurrentLayout(): ILayout | null {
    return this.layoutJson.value;
  }

}
