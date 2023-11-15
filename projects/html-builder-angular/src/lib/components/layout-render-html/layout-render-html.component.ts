import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ILayout } from '../../layout-schema/layout-schema.interface';

@Component({
  selector: 'layout-render-html',
  templateUrl: './layout-render-html.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutRenderHtmlComponent {

  @Input() layout: ILayout | null;

}
