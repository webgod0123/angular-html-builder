import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ILayout } from '../../layout-schema/layout-schema.interface';

@Component({
  selector: 'layout-render-email',
  templateUrl: './layout-render-email.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutRenderEmailComponent implements AfterViewChecked {

  @Input() layout: ILayout | null;
  @Output() onRendered = new EventEmitter<void>();

  ngAfterViewChecked(): void {
    this.onRendered.emit();
  }

}
