import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { TranslateService } from '@interticket/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ISpacing } from '../../../layout-schema/layout-schema.interface';

interface IPaddingList {
  label: string;
  formControlName: string;
}

@Component({
  selector: 'padding-form',
  templateUrl: './padding-form.component.html',
  styleUrls: ['./padding-form.component.scss'],
})

export class PaddingFormComponent implements OnInit, OnChanges {

  @Input() padding: ISpacing;
  @Output() setPadding = new EventEmitter();

  form: FormGroup;
  rowPaddingMore: boolean;
  moreOptions: boolean;
  paddingList: IPaddingList[];

  private readonly ngOnDestroySubject = new Subject();

  constructor(private readonly translateService: TranslateService) {
    this.initForm();
    this.paddingList = [
      { label: this.translateService.get('admin_email_template_top_side'), formControlName: 'top' },
      { label: this.translateService.get('admin_email_template_right_side'), formControlName: 'right' },
      { label: this.translateService.get('admin_email_template_left_side'), formControlName: 'left' },
      { label: this.translateService.get('admin_email_template_bottom_side'), formControlName: 'bottom' },
    ];
  }

  ngOnInit(): void {
    this.subscribeFormChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    const padding = changes.padding.currentValue;
    if (!padding) {
      return;
    }

    this.patchFormValues(padding);
  }

  onToggle(e: MatSlideToggleChange) {
    this.moreOptions = e.checked;
    this.form.patchValue({
      left: this.form.get('all')?.value,
      right: this.form.get('all')?.value,
      top: this.form.get('all')?.value,
      bottom: this.form.get('all')?.value,
    }, { emitEvent: true });
  }

  private patchFormValues(padding: ISpacing) {
    const all = (padding.paddingLeft === padding.paddingRight && padding.paddingRight === padding.paddingTop && padding.paddingTop === padding.paddingLeft);
    this.moreOptions = !all;

    this.form.patchValue({
      all: padding.paddingLeft,
      left: padding.paddingLeft,
      right: padding.paddingRight,
      top: padding.paddingTop,
      bottom: padding.paddingBottom,
    }, { emitEvent: false });
  }

  private initForm() {
    this.form = new FormGroup({
      all: new FormControl('0'),
      left: new FormControl('0'),
      right: new FormControl('0'),
      top: new FormControl('0'),
      bottom: new FormControl('0'),
    });
  }

  private subscribeFormChanges() {
    this.form
      .valueChanges
      .pipe(takeUntil(this.ngOnDestroySubject.asObservable()))
      .subscribe(newValues => {
        let padding: ISpacing;

        if (this.moreOptions) {
          padding = {
            paddingTop: newValues.top,
            paddingLeft: newValues.left,
            paddingRight: newValues.right,
            paddingBottom: newValues.bottom,
          };
        } else {
          padding = {
            paddingTop: newValues.all,
            paddingLeft: newValues.all,
            paddingRight: newValues.all,
            paddingBottom: newValues.all,
          };
        }

        this.setPadding.emit(padding);
      });
  }

}
