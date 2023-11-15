import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseBodyRendererComponent } from '../../../layout-schema/base-components/base-body-renderer/base-body-renderer.component';

@Component({
  selector: 'render-html-body',
  templateUrl: './render-html-body.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RenderHtmlBodyComponent extends BaseBodyRendererComponent {
}
