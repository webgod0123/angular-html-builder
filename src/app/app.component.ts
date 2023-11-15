import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { AAGUID, Utils } from '@interticket/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})

export class AppComponent implements OnInit {

  templateId: AAGUID;
  name = 'My email template';
  headerBackLink =
    'https://ext.stx.interticket.com/#/admin/event/ticket-template/edit-template/e0a35292-ec3f-4715-9d66-9ffcebd86f78';

  constructor(public vcRef: ViewContainerRef) { }

  ngOnInit() {
    this.templateId = Utils.generateGuid();
  }

}
