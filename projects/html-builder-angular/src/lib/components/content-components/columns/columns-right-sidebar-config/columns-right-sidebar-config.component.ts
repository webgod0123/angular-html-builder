import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BackgroundPosition } from '../../../../enums/background-position.enum';
import {
  BackgroundRepeat,
  IBorder,
  IColumn,
  IColumnValues,
  IRow,
  IRowValues,
  ISpacing,
} from '../../../../layout-schema/layout-schema.interface';
import { EditorConfigService } from '../../../../services/editor-config.service';
import { LayoutHandlerService } from '../../../../services/layout-handler.service';
import { RowHandlerService } from '../../../../services/row-handler.service';

@Component({
  selector: 'columns-right-sidebar-config',
  templateUrl: './columns-right-sidebar-config.component.html',
  styleUrls: ['./columns-right-sidebar-config.component.scss'],
})
export class ColumnsRightSidebarConfigComponent implements OnInit, OnDestroy {

  form: FormGroup;
  padding: ISpacing;

  private readonly ngOnDestroySubject = new Subject();

  constructor(
    private readonly editorConfigService: EditorConfigService,
    private layoutHandlerService: LayoutHandlerService,
    private rowHandlerService: RowHandlerService,
    private fb: FormBuilder
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.subscribeForValues();
    this.subscribeFormChanges();
  }

  ngOnDestroy(): void {
    this.ngOnDestroySubject.next(true);
  }

  getColumnPadding(index: number): ISpacing {
    return this.columnsFormArray.at(index).value as ISpacing;
  }

  getColumnBorder(index: number): IBorder {
    return this.columnsFormArray.at(index).value as IBorder;
  }

  setPadding(padding: ISpacing) {
    this.form.patchValue({
      paddingTop: padding.paddingTop,
      paddingLeft: padding.paddingLeft,
      paddingRight: padding.paddingRight,
      paddingBottom: padding.paddingBottom,
    });
  }

  setColumnPadding(padding: ISpacing, index: number) {
    this.columnsFormArray.at(index).patchValue({
      paddingTop: padding.paddingTop,
      paddingLeft: padding.paddingLeft,
      paddingRight: padding.paddingRight,
      paddingBottom: padding.paddingBottom,
    });
  }

  setColumnBorder(border: IBorder, index: number) {
    this.columnsFormArray.at(index).patchValue({
      borderTopStyle: border.borderTopStyle,
      borderTopColor: border.borderTopColor,
      borderTopWidth: border.borderTopWidth,
      borderLeftStyle: border.borderLeftStyle,
      borderLeftColor: border.borderLeftColor,
      borderLeftWidth: border.borderLeftWidth,
      borderRightStyle: border.borderRightStyle,
      borderRightColor: border.borderRightColor,
      borderRightWidth: border.borderRightWidth,
      borderBottomStyle: border.borderBottomStyle,
      borderBottomColor: border.borderBottomColor,
      borderBottomWidth: border.borderBottomWidth,
      borderAll: border.borderAll,
    });
  }

  uploadImageFile(url: string) {
    this.form.patchValue({
      backgroundImageUrl: this.editorConfigService.getImagePath(url),
    });
  }

  setBackgroundPosition(position: BackgroundPosition) {
    this.form.patchValue({
      backgroundPosition: position,
    });
  }

  setBackgroundImageRepeat(repeat: BackgroundRepeat) {
    this.form.patchValue({
      backgroundRepeat: repeat,
    });
  }

  get columnsFormArray(): FormArray {
    return this.form.get('columns') as FormArray;
  }

  private subscribeForValues() {
    this.rowHandlerService.activeRow$
      .pipe(takeUntil(this.ngOnDestroySubject.asObservable()))
      .subscribe((row: IRow | null) => {
        if (!row) {
          return;
        }

        this.setupDynamicColumns(row.columns);

        this.populateFormWithValues(row.values, row.columns);
      });
  }

  private populateFormWithValues(newValues: IRowValues | null, columns: IColumn[]) {
    if (!newValues) {
      return;
    }

    this.padding = {
      paddingTop: newValues.paddingTop ? newValues.paddingTop : 0,
      paddingLeft: newValues.paddingLeft ? newValues.paddingLeft : 0,
      paddingRight: newValues.paddingRight ? newValues.paddingRight : 0,
      paddingBottom: newValues.paddingBottom ? newValues.paddingBottom : 0,
    };

    this.form.patchValue(
      {
        backgroundColor: newValues.backgroundColor ? newValues.backgroundColor : 'rgba(255,255,255,0)',
        contentBackgroundColor: newValues.contentBackgroundColor
          ? newValues.contentBackgroundColor
          : 'rgba(255,255,255,0)',
        backgroundImageUrl: newValues.backgroundImageUrl ? newValues.backgroundImageUrl : '',
        backgroundPosition: newValues.backgroundPosition ? newValues.backgroundPosition : '',
        paddingTop: newValues.paddingTop ? newValues.paddingTop : 0,
        paddingLeft: newValues.paddingLeft ? newValues.paddingLeft : 0,
        paddingRight: newValues.paddingRight ? newValues.paddingRight : 0,
        paddingBottom: newValues.paddingBottom ? newValues.paddingBottom : 0,
        columns: columns.map(column => this.constructColumnValues(column)),
        backgroundRepeat: newValues.backgroundRepeat ? newValues.backgroundRepeat : 'no-repeat',
      },
      { emitEvent: false }
    );
  }

  private subscribeFormChanges() {
    this.form.valueChanges.pipe(takeUntil(this.ngOnDestroySubject.asObservable())).subscribe(newValues => {
      this.layoutHandlerService.updateRowValues(newValues, newValues.columns);
    });
  }

  private initForm() {
    this.form = new FormGroup({
      backgroundColor: new FormControl('rgb(0,0,0)'),
      backgroundRepeat: new FormControl('no-repeat'),
      contentBackgroundColor: new FormControl('rgb(0,0,0)'),
      backgroundImageUrl: new FormControl(''),
      backgroundPosition: new FormControl(''),
      paddingTop: new FormControl(0),
      paddingLeft: new FormControl(0),
      paddingRight: new FormControl(0),
      paddingBottom: new FormControl(0),
      columns: this.fb.array([]),
    });
  }

  private setupDynamicColumns(columns: IColumn[]) {
    this.columnsFormArray.clear({ emitEvent: false });

    columns.forEach(column => {
      this.columnsFormArray.push(this.newColumnFormGroup(column), { emitEvent: false });
    });
  }

  private newColumnFormGroup(column: IColumn): FormGroup {
    return this.fb.group<IColumnValues>(this.constructColumnValues(column));
  }

  private constructColumnValues(column: IColumn): IColumnValues {
    return {
      backgroundColor: column.values.backgroundColor ? column.values.backgroundColor : 'rgba(255,255,255,0)',
      paddingTop: column.values.paddingTop ? column.values.paddingTop : 0,
      paddingLeft: column.values.paddingLeft ? column.values.paddingLeft : 0,
      paddingRight: column.values.paddingRight ? column.values.paddingRight : 0,
      paddingBottom: column.values.paddingBottom ? column.values.paddingBottom : 0,
      borderTopStyle: column.values.borderTopStyle ? column.values.borderTopStyle : 'solid',
      borderTopColor: column.values.borderTopColor ? column.values.borderTopColor : 'rgba(255,255,255,0)',
      borderTopWidth: column.values.borderTopWidth ? column.values.borderTopWidth : 0,
      borderLeftStyle: column.values.borderLeftStyle ? column.values.borderLeftStyle : 'solid',
      borderLeftColor: column.values.borderLeftColor ? column.values.borderLeftColor : 'rgba(255,255,255,0)',
      borderLeftWidth: column.values.borderLeftWidth ? column.values.borderLeftWidth : 0,
      borderRightStyle: column.values.borderRightStyle ? column.values.borderRightStyle : 'solid',
      borderRightColor: column.values.borderRightColor ? column.values.borderRightColor : 'rgba(255,255,255,0)',
      borderRightWidth: column.values.borderRightWidth ? column.values.borderRightWidth : 0,
      borderBottomStyle: column.values.borderBottomStyle ? column.values.borderBottomStyle : 'solid',
      borderBottomColor: column.values.borderBottomColor ? column.values.borderBottomColor : 'rgba(255,255,255,0)',
      borderBottomWidth: column.values.borderBottomWidth ? column.values.borderBottomWidth : 0,
      borderAll: column.values.borderAll ? column.values.borderAll : false,
    };
  }

}
