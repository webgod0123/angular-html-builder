import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IHTMLBuilderService } from '../../../../interfaces';
import { IRow } from '../../../../layout-schema/layout-schema.interface';
import { HTML_BUILDER_SERVICE } from '../../../../providers/email-template-editor-service.provider';

@Component({
  selector: 'create-component-dialog',
  templateUrl: './create-component-dialog.component.html',
  styleUrls: ['./create-component-dialog.component.scss'],
})

export class CreateComponentDialogComponent {

  form: FormGroup;

  constructor(private readonly dialogRef: MatDialogRef<CreateComponentDialogComponent>,
    @Inject(HTML_BUILDER_SERVICE) private readonly htmlBuilderService: IHTMLBuilderService,
    @Inject(MAT_DIALOG_DATA) private data?: IRow) {
    this.initForm();
  }

  formValue(formControl: string) {
    return this.form.get(formControl)?.value;
  }

  private initForm() {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
    });
  }

  create() {
    if (this.form.valid) {
      const componentName = this.formValue('name') as string;
      if (componentName) {
        this.htmlBuilderService.createComponent(componentName, this.data).subscribe(() => this.dialogRef.close());
      }
    }
  }

  cancel() {
    this.dialogRef.close();
  }

}
