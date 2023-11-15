import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IAutocompleteAsyncConfig } from '@interticket/editor-ui-kit';
import { NgxPermissionsService } from 'ngx-permissions';
import { Observable, Subscription } from 'rxjs';
import { map, pairwise, startWith } from 'rxjs/operators';
import { EmailTemplatePermission } from '../../../enums/email-template-permissions.enum';
import { EmailTemplateStatus } from '../../../enums/email-template-status.enum';
import { EmailTemplateType } from '../../../enums/email-template-type.enum';
import { IHTMLBuilderService } from '../../../interfaces';
import { IEmailTemplateDetail } from '../../../interfaces/email-template-detail.interface';
import { IEmailTemplateCreateRequest } from '../../../interfaces/email-template-edit.interface';
import { IEmailType } from '../../../interfaces/email-type.interface';
import { IPartnerHierarchyListItem, PartnerHierarchyLevel } from '../../../interfaces/partner-hierarchy.interface';
import { HTML_BUILDER_SERVICE } from '../../../providers/email-template-editor-service.provider';
import { PartnerHierarchyService } from '../../../services/partner-hierarchy.service';

interface ICreateTemplateDialogData {
  title: string;
  createTitle: string;
  onSave?: (data: IEmailTemplateCreateRequest) => Observable<IEmailTemplateDetail>;
  templateLink?: string;
}

interface IEmailTemplateType {
  name: EmailTemplateType;
  label: string;
}

@Component({
  selector: 'create-template-dialog',
  templateUrl: 'create-template-dialog.component.html',
  styleUrls: ['./create-template-dialog.component.scss'],
})
export class CreateTemplateDialogComponent implements OnInit, OnDestroy {

  form: FormGroup;

  emailTemplateTypes: IEmailTemplateType[] = this.setEmailTemplateTypes();
  partnerHierarchyList$ = this.partnerHierarchyService.partnerHierarchyList$;

  regionList: IPartnerHierarchyListItem[] = [];
  partnerList: IPartnerHierarchyListItem[] = [];

  showDetails = false;
  isTypeReadOnly = true;

  hasCreateMasterPermission = false;
  hasCreateCustomPermission = false;
  hasCopyPermission = false;

  private subscription?: Subscription;
  private partnerSubscription?: Subscription;

  readonly emailTypeAutocompleteConfig: IAutocompleteAsyncConfig<IEmailType> = this.getEmailTypeAutocompleteConfig();

  constructor(
    @Inject(HTML_BUILDER_SERVICE) private readonly htmlBuilderService: IHTMLBuilderService,
    @Inject(MAT_DIALOG_DATA) public readonly data: ICreateTemplateDialogData,
    public readonly partnerHierarchyService: PartnerHierarchyService,
    private readonly permissionService: NgxPermissionsService,
    private readonly dialogRef: MatDialogRef<CreateTemplateDialogComponent>,
    private readonly router: Router
  ) {
    this.setupForm();
  }

  async ngOnInit() {
    await this.initPermissions();
    this.initData();
    this.subscribeValues();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    this.partnerSubscription?.unsubscribe();
  }

  setEmailTemplateTypes() {
    return Object.values(EmailTemplateType).map(name => ({ label: `template_${name}_label`, name }));
  }

  private setupForm() {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      description: new FormControl(''),
      status: new FormControl({ value: false, disabled: true }),
      templateType: new FormControl(null, Validators.required),
      emailTypeId: new FormControl('', Validators.required),
      partnerIds: new FormControl([]),
      regionIds: new FormControl([]),
    });
  }

  private subscribeValues() {
    this.subscription = this.form
      .get('templateType')
      ?.valueChanges.pipe(startWith(null), pairwise())
      .subscribe(([prev, next]: [IEmailTemplateType | null, IEmailTemplateType | null]) => {
        if (prev === next) {
          return;
        }

        if (this.isMasterTemplateSelected()) {
          if (this.partnerHierarchyService.isPlatformLevel) {
            this.form.patchValue({
              regionIds: [],
            });
          }

          if (this.partnerHierarchyService.isRegionLevel) {
            this.form.patchValue({
              partnerIds: [],
            });
          }

          if (this.partnerHierarchyService.isPartnerLevel) {
            this.form.patchValue({
              partnerIds: [this.partnerHierarchyService.currentPartner],
            });
          }
        } else {
          this.form.patchValue({
            partnerIds: [],
            regionIds: [],
          });
        }
      });
  }

  private getEmailTypeAutocompleteConfig(): IAutocompleteAsyncConfig<IEmailType> {
    return {
      getItems: search =>
        this.htmlBuilderService
          .getEmailTypes({ limit: 100, order: 'asc', orderBy: 'name', pageIndex: 0 }, { name: search })
          .pipe(map(res => res.results)),
    };
  }

  async initPermissions() {
    const [hasCreateMasterPermission, hasCreateCustomPermission] = await Promise.all([
      this.permissionService.hasPermission(EmailTemplatePermission.CREATE_MASTER),
      this.permissionService.hasPermission(EmailTemplatePermission.CREATE_CUSTOM),
    ]);

    this.hasCreateMasterPermission = hasCreateMasterPermission;
    this.hasCreateCustomPermission = hasCreateCustomPermission;
  }

  async initData() {
    this.form.disable({ emitEvent: false });

    this.partnerSubscription = this.partnerHierarchyList$.subscribe(partnerHierarchyLis => {
      this.form.enable({ emitEvent: false });

      this.partnerList = partnerHierarchyLis.filter(partner => partner.level === PartnerHierarchyLevel.PARTNER);
      this.regionList = partnerHierarchyLis.filter(partner => partner.level === PartnerHierarchyLevel.REGION);

      this.form.patchValue(
        {
          partnerIds: [],
          regionIds: [],
        },
        { emitEvent: false }
      );

      this.initTypeField();
    });
  }

  initTypeField() {
    this.isTypeReadOnly = false;

    if (this.hasCreateCustomPermission && !this.hasCreateMasterPermission) {
      this.form.patchValue({
        templateType: this.emailTemplateTypes.find(type => type.name === EmailTemplateType.CUSTOM),
      });

      this.isTypeReadOnly = true;

      return;
    }

    if (!this.hasCreateCustomPermission && this.hasCreateMasterPermission) {
      this.form.patchValue({
        templateType: this.emailTemplateTypes.find(type => type.name === EmailTemplateType.MASTER),
      });

      return;
    }

    this.form.patchValue({
      templateType: this.emailTemplateTypes.find(type => type.name === EmailTemplateType.CUSTOM),
    });
  }

  isMasterTemplateSelected() {
    return this.form.get('templateType')?.value?.name === EmailTemplateType.MASTER;
  }

  onClickShowHide() {
    this.showDetails = !this.showDetails;
  }

  onClose() {
    this.form.markAllAsTouched();

    if (!this.form.valid) {
      return;
    }

    const value = {
      ...this.form.value,
      emailTypeId: this.form.value.emailTypeId?.id,
      status: this.form.value.status ? EmailTemplateStatus.ACTIVE : EmailTemplateStatus.INACTIVE,
      templateType: this.form.value.templateType?.name,
      partnerIds: this.form.value.partnerIds?.map((item: IPartnerHierarchyListItem) => item.partnerId) || [],
      regionIds: this.form.value.regionIds?.map((item: IPartnerHierarchyListItem) => item.partnerId) || [],
    };

    if (this.data.onSave) {
      this.form.disable();

      this.data.onSave(value).subscribe(result => {
        this.dialogRef.close();
        this.form.enable();

        if (this.data.templateLink) {
          this.router.navigate([this.data.templateLink, result.id, 'layouts', result.layoutId, 'editor']);
        }
      });
    } else {
      this.dialogRef.close();
    }
  }

}
