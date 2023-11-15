import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { TranslateService } from '@interticket/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IBorderRadius } from '../../../layout-schema/layout-schema.interface';

interface IPaddingList {
  label: string;
  formControlName: string;
}

@Component({
  selector: 'rounded-border-form',
  templateUrl: './rounded-border-form.component.html',
  styleUrls: ['./rounded-border-form.component.scss'],
})

export class RoundedBorderFormComponent implements OnInit, OnChanges {

  @Input() borderRadius: IBorderRadius;
  @Output() setBorderRadius = new EventEmitter();

  form: FormGroup;
  moreOptions: boolean;
  borderRadiusList: IPaddingList[];

  private readonly ngOnDestroySubject = new Subject();

  constructor(private readonly translateService: TranslateService) {
    this.initForm();
    this.borderRadiusList = [
      { label: this.translateService.get('admin_email_template_top_left'), formControlName: 'topLeft' },
      { label: this.translateService.get('admin_email_template_top_right'), formControlName: 'topRight' },
      { label: this.translateService.get('admin_email_template_bottom_left'), formControlName: 'bottomLeft' },
      { label: this.translateService.get('admin_email_template_bottom_right'), formControlName: 'bottomRight' },
    ];
  }

  ngOnInit(): void {
    this.subscribeFormChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    const borderRadius = changes.borderRadius.currentValue;
    if (!borderRadius) {
      return;
    }

    this.patchFormValues(borderRadius);
  }

  onToggle(e: MatSlideToggleChange) {
    this.moreOptions = e.checked;
    this.form.patchValue({
      topLeft: this.form.get('all')?.value,
      topRight: this.form.get('all')?.value,
      bottomLeft: this.form.get('all')?.value,
      bottomRight: this.form.get('all')?.value,
    }, { emitEvent: true });
  }

  private patchFormValues(borderRadius: IBorderRadius) {
    const all = (borderRadius.topLeft === borderRadius.topRight && borderRadius.topRight === borderRadius.bottomLeft && borderRadius.bottomLeft === borderRadius.bottomRight);
    this.moreOptions = !all;

    this.form.patchValue({
      all: borderRadius.topLeft,
      topLeft: borderRadius.topLeft,
      topRight: borderRadius.topRight,
      bottomLeft: borderRadius.bottomLeft,
      bottomRight: borderRadius.bottomRight,
    }, { emitEvent: false });
  }

  private initForm() {
    this.form = new FormGroup({
      all: new FormControl('0'),
      topLeft: new FormControl('0'),
      topRight: new FormControl('0'),
      bottomLeft: new FormControl('0'),
      bottomRight: new FormControl('0'),
    });
  }

  private subscribeFormChanges() {
    this.form
      .valueChanges
      .pipe(takeUntil(this.ngOnDestroySubject.asObservable()))
      .subscribe(newValues => {
        let borderRadius: IBorderRadius;

        if (this.moreOptions) {
          borderRadius = {
            topLeft: newValues.topLeft,
            topRight: newValues.topRight,
            bottomLeft: newValues.bottomLeft,
            bottomRight: newValues.bottomRight,
          };
        } else {
          borderRadius = {
            topLeft: newValues.all,
            topRight: newValues.all,
            bottomLeft: newValues.all,
            bottomRight: newValues.all,
          };
        }

        this.setBorderRadius.emit(borderRadius);
      });
  }

}
