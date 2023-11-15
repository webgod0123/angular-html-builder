import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseMenuRendererComponent } from '../../../layout-schema/base-components/base-menu-renderer/base-menu-renderer.component';

@Component({
  selector: 'render-email-menu',
  templateUrl: './render-email-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RenderEmailMenuComponent extends BaseMenuRendererComponent {}
