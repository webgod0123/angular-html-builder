import { Inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { IHTMLBuilderService } from '../interfaces';
import { IPartnerHierarchyListItem, PartnerHierarchyLevel } from '../interfaces/partner-hierarchy.interface';
import { HTML_BUILDER_SERVICE } from '../providers/email-template-editor-service.provider';
import { PARTNER_ID_ACCESSOR } from '../providers/partner-id.provider';

@Injectable()
export class PartnerHierarchyService {

  isLoading = true;
  partnerHierarchyList = new Subject<IPartnerHierarchyListItem[]>();
  partnerHierarchyList$: Observable<IPartnerHierarchyListItem[]> = this.partnerHierarchyList.asObservable();

  currentPartner: IPartnerHierarchyListItem | null = null;

  constructor(
    @Inject(HTML_BUILDER_SERVICE) private readonly htmlBuilderService: IHTMLBuilderService,
    @Inject(PARTNER_ID_ACCESSOR) private readonly partnerId: string,
  ) {
    this.loadPartnerHierarchy();
  }

  get isPlatformLevel() {
    return this.currentPartner?.level === PartnerHierarchyLevel.PLATFORM;
  }

  get isRegionLevel() {
    return this.currentPartner?.level === PartnerHierarchyLevel.REGION;
  }

  get isPartnerLevel() {
    return this.currentPartner?.level === PartnerHierarchyLevel.PARTNER;
  }

  loadPartnerHierarchy() {
    return this.htmlBuilderService.getPartnerHierarchy()
      .pipe(
        finalize(() => this.isLoading = false),
        tap((result) => {
          this.partnerHierarchyList.next(result);
        })
      ).subscribe(partnerHierarchyList => {
        this.currentPartner = partnerHierarchyList.find((partner) => partner.partnerId === this.partnerId) || null;
      });
  }

}
