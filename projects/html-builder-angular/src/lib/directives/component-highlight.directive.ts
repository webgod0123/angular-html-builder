import { ChangeDetectorRef, Directive, HostBinding, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { LayoutHandlerService } from '../services/layout-handler.service';

@Directive({
  selector: '[componentHighlight]',
})
export class ComponentHighlightDirective implements OnInit, OnDestroy {

  @Input() componentId: string;

  private readonly HIGHLIGHT_CLASS = 'builder-component-highlighted';
  private readonly SELECTED_CLASS = 'builder-component-selected';

  private thisComponentIsSelected = false;

  private readonly ngOnDestroySubject = new Subject();

  @HostBinding('class')
    elementClass = '';

  @HostListener('mouseenter') onMouseEnter() {
    if (!this.thisComponentIsSelected) {
      this.elementClass = this.HIGHLIGHT_CLASS;
    }
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (!this.thisComponentIsSelected) {
      this.elementClass = '';
    }
  }

  constructor(private layoutHandlerService: LayoutHandlerService, private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.subscribeSelectedContent();
  }

  ngOnDestroy(): void {
    this.ngOnDestroySubject.next(true);
  }

  private subscribeSelectedContent(): void {
    this.layoutHandlerService.lastSelectedContentId$
      .pipe(takeUntil(this.ngOnDestroySubject.asObservable()), distinctUntilChanged())
      .subscribe(id => {
        if (this.componentId === id) {
          this.thisComponentIsSelected = true;
          this.elementClass = this.SELECTED_CLASS;
          this.changeDetectorRef.markForCheck();
        } else {
          this.thisComponentIsSelected = false;
          this.elementClass = '';
          this.changeDetectorRef.markForCheck();
        }
      });
  }

}
