import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ElementAlignmentType } from '../../../enums';
import { EventType } from '../../../enums/event-type.enum';
import { DateFormat } from '../../../enums/date-format.enum';
import { ISelectOption } from '../../../interfaces/select-option.interface';
import { VariablesHandlerService } from '../../../services/variables-handler.service';
import { IVariableValue } from '../../../layout-schema/layout-schema.interface';
import { LayoutHandlerService } from '../../../services/layout-handler.service';

@Component({
  selector: 'variables-config',
  templateUrl: './variables-config.component.html',
  styleUrls: ['./variables-config.component.scss'],
})
export class VariablesConfigComponent implements OnInit, OnDestroy {

  form: FormGroup;
  alignmentType = ElementAlignmentType.HORIZONTAL;
  isDateVariable?: boolean = false;

  readonly eventTypeList: ISelectOption[] = this.constructEventTypeList();
  readonly dateFormatList: ISelectOption[] = this.constructDateFormatList();

  private readonly ngOnDestroySubject = new Subject();

  constructor(private variablesHandlerService: VariablesHandlerService, private layoutHandlerService: LayoutHandlerService) {
    this.initForm();
  }

  ngOnInit(): void {
    this.subscribeForValues();
    this.subscribeFormChanges();
  }

  ngOnDestroy(): void {
    this.ngOnDestroySubject.next(true);
  }

  private initForm() {
    this.form = new FormGroup({
      lineHeight: new FormControl(0),
      textColor: new FormControl('rgb(0,0,0)'),
      padding: new FormControl(0),
      conditionalDisplay: new FormControl([]),
      dateFormat: new FormControl(''),
    });
  }

  private constructEventTypeList(): ISelectOption[] {
    return [
      { key: EventType.Normal, name: 'Normal' },
      { key: EventType.Video, name: 'Video' },
      { key: EventType.Livestream, name: 'Livestream' },
      { key: EventType.LivestreamVideo, name: 'LivestreamVideo' },
      { key: EventType.Cards, name: 'Cards' },
    ];
  }

  private constructDateFormatList(): ISelectOption[] {
    return [
      { key: DateFormat.short, name: DateFormat.short },
      { key: DateFormat.medium, name: DateFormat.medium },
      { key: DateFormat.full, name: DateFormat.full },
      { key: DateFormat.yyyyMMddhhmm, name: DateFormat.yyyyMMddhhmm },
    ];
  }

  private subscribeForValues() {
    this.variablesHandlerService
      .activeValues$
      .pipe(takeUntil(this.ngOnDestroySubject.asObservable()))
      .subscribe(newValues => {
        this.populateFormWithValues(newValues);
      });
  }

  private populateFormWithValues(newValues: IVariableValue | null) {
    if (!newValues) {
      return;
    }

    this.isDateVariable = newValues.isDate;

    this.form.patchValue({
      lineHeight: newValues.lineHeight,
      dateFormat: newValues.dateFormat,
      textColor: newValues.textColor,
    }, { emitEvent: false });
  }

  private subscribeFormChanges() {
    this.form
      .valueChanges
      .pipe(takeUntil(this.ngOnDestroySubject.asObservable()))
      .subscribe(newValues => {
        this.layoutHandlerService.updateVariableBlockValues(newValues);
      });
  }

}
