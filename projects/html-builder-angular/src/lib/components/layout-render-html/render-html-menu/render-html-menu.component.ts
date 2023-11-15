import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseMenuRendererComponent } from '../../../layout-schema/base-components/base-menu-renderer/base-menu-renderer.component';

@Component({
  selector: 'render-html-menu',
  templateUrl: './render-html-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RenderHtmlMenuComponent extends BaseMenuRendererComponent {}
