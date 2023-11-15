import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { HTMLBuilderType } from '../../enums/html-builder-type.enum';
import { ILayout } from '../../layout-schema/layout-schema.interface';
import { BuilderInterfaceService } from '../../services/builder-interface.service';
import { LayoutExporterService } from '../../services/layout-exporter.service';
import { LayoutHandlerService } from '../../services/layout-handler.service';
import { LayoutStateService } from '../../services/layout-state.service';

@Component({
  selector: 'layout-canvas',
  templateUrl: './layout-canvas.component.html',
  styleUrls: ['./layout-canvas.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutCanvasComponent {

  leftMenuOpen$ = this.builderInterfaceService.leftMenuOpen$;
  rightMenuOpen$ = this.builderInterfaceService.rightMenuOpen$;
  isSmallLeftMenu$ = this.builderInterfaceService.isSmallLeftMenu$;
  hasSubLeftMenu$ = this.builderInterfaceService.hasSubLeftMenu$;

  @ViewChild('layoutHtml', { read: ElementRef, static: false }) LayoutHtml: ElementRef;
  @ViewChild('layoutEmail', { read: ElementRef, static: true }) LayoutEmail: ElementRef;

  @Input() activeType: HTMLBuilderType;

  @Input() set layout(layout: ILayout | null) {
    this._layout = layout;

    this.layoutHandlerService.setInitialLayoutJson(layout);
  }

  get layout(): ILayout | null {
    return this._layout;
  }

  renderEmailLayoutActive = false;
  private readonly emailMarkup$ = new Subject<string>();

  readonly HTMLBuilderType = HTMLBuilderType;

  private _layout: ILayout | null;

  constructor(
    private layoutHandlerService: LayoutHandlerService,
    public layoutStateService: LayoutStateService,
    private layoutExporterService: LayoutExporterService,
    private builderInterfaceService: BuilderInterfaceService,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  getRenderedLayout(markupVersionToSave: HTMLBuilderType): Observable<string> {
    if (markupVersionToSave === HTMLBuilderType.EMAIL) {
      return this.renderEmailLayout();
    } else {
      return this.renderWebLayout();
    }
  }

  onEmailLayoutRendered(): void {
    const html = this.LayoutEmail.nativeElement.innerHTML;
    const cleanedHtml = this.layoutExporterService.cleanupEmailMarkup(html);
    this.renderEmailLayoutActive = false;
    this.emailMarkup$.next(cleanedHtml);
  }

  /**
   * For EMAIL version we have to render `layout-render-email` component.
   */
  private renderEmailLayout(): Observable<string> {
    this.renderEmailLayoutActive = true;
    this.changeDetectorRef.markForCheck();

    return this.emailMarkup$;
  }

  /**
   * For HTML version we use the currently rendered `layout-render-html`
   */
  private renderWebLayout(): Observable<string> {
    const html = this.LayoutHtml.nativeElement.innerHTML;
    const cleanedHtml = this.layoutExporterService.cleanupWebMarkup(html);

    return of(cleanedHtml);
  }

}
