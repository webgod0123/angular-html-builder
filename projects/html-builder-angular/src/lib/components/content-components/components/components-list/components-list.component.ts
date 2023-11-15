import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, finalize, takeUntil } from 'rxjs/operators';
import { PAGINATION_SIZE } from '../../../../config';
import { ContentComponentType } from '../../../../enums';
import { IHTMLBuilderService } from '../../../../interfaces';
import { IEmailComponentListItem } from '../../../../interfaces/email-component-list-item.interface';
import { ISelectOption } from '../../../../interfaces/select-option.interface';
import { HTML_BUILDER_SERVICE } from '../../../../providers/email-template-editor-service.provider';
import { EditorConfigService } from '../../../../services/editor-config.service';

@Component({
  selector: 'components-list',
  templateUrl: './components-list.component.html',
  styleUrls: ['./components-list.component.scss'],
})

export class ComponentsListComponent implements OnInit, OnDestroy {

  formBuilder = new FormBuilder();
  form: FormGroup;
  isShowAllFilter = false;
  isLoading = false;
  hasMore = false;
  componentList: IEmailComponentListItem[] = [];

  private readonly destroy$ = new Subject();

  statusList: ISelectOption[] = [
    { key: 'active', name: 'active' },
    { key: 'deleted', name: 'deleted' },
  ];

  readonly ContentComponentType = ContentComponentType;

  constructor(
    @Inject(HTML_BUILDER_SERVICE) private readonly htmlBuilderService: IHTMLBuilderService,
    private readonly editorConfigService: EditorConfigService,
  ) {

  }

  ngOnInit(): void {
    this.initForm();
    this.loadComponents();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getImagePath(url: string) {
    return this.editorConfigService.getImagePath(url);
  }

  private initForm() {
    this.form = this.formBuilder.group({
      name: [null, [Validators.maxLength(50)]],
      status: [[]],
    });

    this.form.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(250)
      )
      .subscribe(() => {
        this.reload();
      });
  }

  private loadComponents() {
    if (this.isLoading) {
      return;
    }

    this.isLoading = true;

    const searchFormData = this.form.value;
    this.htmlBuilderService.getComponentList(PAGINATION_SIZE, this.componentList.length, false, searchFormData)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe((data) => {
        this.componentList = [...this.componentList, ...data.results];
        if (data.results.length < PAGINATION_SIZE) {
          this.hasMore = false;
        } else {
          this.hasMore = true;
        }
      });
  }

  private reload(): void {
    this.componentList = [];
    this.loadComponents();
  }

  toggleForm(): void {
    this.isShowAllFilter = !this.isShowAllFilter;
  }

  onSelectComponent(component: IEmailComponentListItem): void {
    //
  }

  onScrollDown(): void {
    this.loadComponents();
  }

}
