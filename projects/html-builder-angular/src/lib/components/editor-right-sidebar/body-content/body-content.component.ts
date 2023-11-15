import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ElementAlignments, ElementAlignmentType } from '../../../enums';
import { LayoutHandlerService } from '../../../services/layout-handler.service';
import { BodyHandlerService } from '../../../services/body-handler.service';
import { IBodyValues } from '../../../layout-schema/layout-schema.interface';

@Component({
  selector: 'body-content',
  templateUrl: './body-content.component.html',
  styleUrls: ['./body-content.component.scss'],
})
export class BodyContentComponent implements OnInit, OnDestroy {

  form: FormGroup;
  alignmentType = ElementAlignmentType.CONTENT;

  fonts = [
    { name: 'Arial', value: 'Arial' },
    { name: 'Roboto', value: 'Roboto' },
  ];

  underline = false;

  private readonly ngOnDestroySubject = new Subject();

  constructor(private layoutHandlerService: LayoutHandlerService, private bodyHandlerService: BodyHandlerService) {}

  ngOnInit(): void {
    this.initForm();
    this.subscribeForValues();
    this.subscribeFormChanges();
  }

  ngOnDestroy(): void {
    this.ngOnDestroySubject.next(true);
  }

  formValue(formControl: string) {
    return this.form.get(formControl)?.value;
  }

  setAlignment(alignment: ElementAlignments) {
    this.form.patchValue({
      contentAlignment: alignment,
    },);
  }

  private initForm(): void {
    this.form = new FormGroup({
      textColor: new FormControl('rgb(0,0,0)'),
      backgroundColor: new FormControl('rgb(0,0,0)'),
      contentWidth: new FormControl(0),
      contentAlignment: new FormControl(ElementAlignments.HORIZONTAL_CENTER),
      fontFamily: new FormControl('Roboto'),
      linkColor: new FormControl('rgb(0,0,0)'),
      underline: new FormControl(false),
    });
  }

  private subscribeFormChanges() {
    this.form
      .valueChanges
      .pipe(takeUntil(this.ngOnDestroySubject.asObservable()))
      .subscribe(newValues => {
        this.layoutHandlerService.updateBodyValues(newValues);
      });
  }

  private subscribeForValues() {
    this.bodyHandlerService
      .activeValues$
      .pipe(takeUntil(this.ngOnDestroySubject.asObservable()))
      .subscribe(newValues => {
        this.populateFormWithValues(newValues);
      });
  }

  private populateFormWithValues(newValues: IBodyValues | null) {
    if (!newValues) {
      return;
    }

    this.form.patchValue({
      textColor: newValues.textColor,
      backgroundColor: newValues.backgroundColor,
      contentWidth: newValues.contentWidth,
      contentAlignment: newValues.contentAlignment,
      fontFamily: newValues.fontFamily,
      linkColor: newValues.linkColor,
      underline: newValues.underline,
    }, { emitEvent: false });
  }

}
