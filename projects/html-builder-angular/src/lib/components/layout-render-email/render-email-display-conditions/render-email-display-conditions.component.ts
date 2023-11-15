import { Component } from '@angular/core';
import { BaseDisplayConditionsRendererComponent } from '../../../layout-schema/base-components/base-display-conditions-renderer/base-display-conditions-renderer.component';

@Component({
  selector: 'render-email-display-conditions',
  templateUrl: './render-email-display-conditions.component.html',
  styleUrls: ['./render-email-display-conditions.component.scss'],
})

export class RenderEmailDisplayConditionsComponent extends BaseDisplayConditionsRendererComponent {}
