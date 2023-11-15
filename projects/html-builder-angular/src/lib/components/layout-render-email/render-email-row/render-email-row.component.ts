import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseRowRendererComponent } from '../../../layout-schema/base-components/base-row-renderer/base-row-renderer.component';
import { BaseColumnRendererComponent } from '../../../layout-schema/base-components/base-column-renderer/base-column-renderer.component';
import { BaseContentRendererComponent } from '../../../layout-schema/base-components/base-content-renderer/base-content-renderer.component';
import { BaseEventRendererComponent } from '../../../layout-schema/base-components/base-event-renderer/base-event-renderer.component';

/**
 * NOTE: Because we are rendering components recursively (row -> column -> content -> event -> row)
 * and that causes circular dependency error during library compile,
 * we need to place circularly dependant components is same file, to avoid compile time error:
 * error NG3003: One or more import cycles would need to be created to compile this component, which is not supported by the current compiler configuration.
 *
 * @See: https://angular.io/errors/NG3003
 */

@Component({
  selector: 'render-email-row',
  templateUrl: './render-email-row.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RenderEmailRowComponent extends BaseRowRendererComponent {
}

@Component({
  selector: 'render-email-column',
  templateUrl: '../render-email-column/render-email-column.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RenderEmailColumnComponent extends BaseColumnRendererComponent {
}

@Component({
  selector: 'render-email-content',
  templateUrl: '../render-email-content/render-email-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class RenderEmailContentComponent extends BaseContentRendererComponent { }

@Component({
  selector: 'render-email-event',
  templateUrl: '../render-email-event/render-email-event.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RenderEmailEventComponent extends BaseEventRendererComponent {
}
