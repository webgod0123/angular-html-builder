import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { TranslateService } from '@interticket/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IBorder } from '../../../layout-schema/layout-schema.interface';

interface IBorderList {
  label: string;
  formControlName: string;
}

@Component({
  selector: 'border-form',
  templateUrl: './border-form.component.html',
  styleUrls: ['./border-form.component.scss'],
})

export class BorderFormComponent implements OnInit, OnChanges {

  @Input() border: IBorder;
  @Input() moreOption = true;
  @Output() setBorder = new EventEmitter();

  borderStyles = [
    { label: this.translateService.get('admin_ticket_template_border_style_dotted'), value: 'dotted', icon: 'dotted' },
    { label: this.translateService.get('admin_ticket_template_border_style_dashed'), value: 'dashed', icon: 'dashed' },
    { label: this.translateService.get('admin_ticket_template_border_style_solid'), value: 'solid', icon: 'solid' },
  ];

  form: FormGroup;
  rowPaddingMore: boolean;
  moreOptions: boolean;

  borderList: IBorderList[];

  private readonly ngOnDestroySubject = new Subject();

  constructor(private readonly translateService: TranslateService) {
    this.initForm();
    this.borderList = [
      { label: this.translateService.get('admin_email_template_top_side'), formControlName: 'Top' },
      { label: this.translateService.get('admin_email_template_right_side'), formControlName: 'Right' },
      { label: this.translateService.get('admin_email_template_left_side'), formControlName: 'Left' },
      { label: this.translateService.get('admin_email_template_bottom_side'), formControlName: 'Bottom' },
    ];
  }

  ngOnInit(): void {
    this.subscribeFormChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    const border = changes.border.currentValue;
    if (!border) {
      return;
    }

    this.patchFormValues(border);
  }

  onToggle(e: MatSlideToggleChange) {
    this.moreOptions = e.checked;

    this.form.patchValue({
      borderTopStyle: this.form.get('borderStyle')?.value,
      borderTopColor: this.form.get('borderColor')?.value,
      borderTopWidth: this.form.get('borderWidth')?.value,
      borderRightStyle: this.form.get('borderStyle')?.value,
      borderRightColor: this.form.get('borderColor')?.value,
      borderRightWidth: this.form.get('borderWidth')?.value,
      borderLeftStyle: this.form.get('borderStyle')?.value,
      borderLeftColor: this.form.get('borderColor')?.value,
      borderLeftWidth: this.form.get('borderWidth')?.value,
      borderBottomStyle: this.form.get('borderStyle')?.value,
      borderBottomColor: this.form.get('borderColor')?.value,
      borderBottomWidth: this.form.get('borderWidth')?.value,
    }, { emitEvent: true });
  }

  formControlName(label: string, side: string) {
    return `border${side}${label}`;
  }

  private initForm() {
    this.form = new FormGroup({
      borderStyle: new FormControl('solid'),
      borderColor: new FormControl('rgb(0,0,0)'),
      borderWidth: new FormControl('0'),
      borderTopStyle: new FormControl('solid'),
      borderTopColor: new FormControl('rgb(0,0,0)'),
      borderTopWidth: new FormControl('0'),
      borderLeftStyle: new FormControl('solid'),
      borderLeftColor: new FormControl('rgb(0,0,0)'),
      borderLeftWidth: new FormControl('0'),
      borderRightStyle: new FormControl('solid'),
      borderRightColor: new FormControl('rgb(0,0,0)'),
      borderRightWidth: new FormControl('0'),
      borderBottomStyle: new FormControl('solid'),
      borderBottomColor: new FormControl('rgb(0,0,0)'),
      borderBottomWidth: new FormControl('0'),
    });
  }

  private patchFormValues(border: IBorder) {
    this.moreOptions = border.borderAll ? border.borderAll : false;

    this.form.patchValue({
      borderStyle: border.borderTopStyle,
      borderColor: border.borderTopColor,
      borderWidth: border.borderTopWidth,
      borderLeftStyle: border.borderLeftStyle,
      borderLeftColor: border.borderLeftColor,
      borderLeftWidth: border.borderLeftWidth,
      borderRightStyle: border.borderRightStyle,
      borderRightColor: border.borderRightColor,
      borderRightWidth: border.borderRightWidth,
      borderTopStyle: border.borderTopStyle,
      borderTopColor: border.borderTopColor,
      borderTopWidth: border.borderTopWidth,
      borderBottomStyle: border.borderBottomStyle,
      borderBottomColor: border.borderBottomColor,
      borderBottomWidth: border.borderBottomWidth,
    }, { emitEvent: false });
  }

  private subscribeFormChanges() {
    this.form
      .valueChanges
      .pipe(takeUntil(this.ngOnDestroySubject.asObservable()))
      .subscribe(newValues => {
        if (!this.moreOptions) {
          newValues.borderTopStyle = newValues.borderStyle;
          newValues.borderTopColor = newValues.borderColor;
          newValues.borderTopWidth = newValues.borderWidth;

          newValues.borderLeftStyle = newValues.borderStyle;
          newValues.borderLeftColor = newValues.borderColor;
          newValues.borderLeftWidth = newValues.borderWidth;

          newValues.borderRightStyle = newValues.borderStyle;
          newValues.borderRightColor = newValues.borderColor;
          newValues.borderRightWidth = newValues.borderWidth;

          newValues.borderBottomStyle = newValues.borderStyle;
          newValues.borderBottomColor = newValues.borderColor;
          newValues.borderBottomWidth = newValues.borderWidth;
        }

        this.setBorder.emit({ ...newValues, borderAll: this.moreOptions });
      });
  }

}
