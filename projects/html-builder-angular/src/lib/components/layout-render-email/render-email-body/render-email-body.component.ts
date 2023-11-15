import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseBodyRendererComponent } from '../../../layout-schema/base-components/base-body-renderer/base-body-renderer.component';

@Component({
  selector: 'render-email-body',
  templateUrl: './render-email-body.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RenderEmailBodyComponent extends BaseBodyRendererComponent {
}
