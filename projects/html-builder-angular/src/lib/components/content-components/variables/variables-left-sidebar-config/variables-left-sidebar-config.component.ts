import { Component, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IEventVariable, IHTMLBuilderService } from '../../../../interfaces';
import { ContentComponentType } from '../../../../enums';
import { HTML_BUILDER_SERVICE } from '../../../../providers/email-template-editor-service.provider';

@Component({
  selector: 'variables-left-sidebar-config',
  templateUrl: './variables-left-sidebar-config.component.html',
  styleUrls: ['./variables-left-sidebar-config.component.scss'],
})

export class VariablesLeftSideBarConfigComponent {

  variableList$: Observable<IEventVariable[]> = this.emailTemplateService.getEventVariables();

  readonly ContentComponentType = ContentComponentType;

  constructor(@Inject(HTML_BUILDER_SERVICE) private readonly emailTemplateService: IHTMLBuilderService,) {
  }

}
