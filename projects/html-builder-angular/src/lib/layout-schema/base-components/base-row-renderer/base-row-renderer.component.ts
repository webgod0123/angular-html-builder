import { Component, Input, OnInit } from '@angular/core';
import { ContentComponentType } from '../../../enums';
import { IBody, IRow } from '../../layout-schema.interface';
import { calculateWidthPercent } from '../../renderer/row-helper';

@Component({
  template: '',
})
export abstract class BaseRowRendererComponent implements OnInit {

  @Input() layoutJson: IRow;

  /**
   * Body can be null if row is rendered in nested place.
   */
  @Input() body?: IBody;

  readonly ContentComponentType = ContentComponentType;

  calculateWidthPercent = calculateWidthPercent;

  backgroundImage: string;
  contentWidth: string;

  ngOnInit(): void {
    this.setupBackgroundImage(this.layoutJson);
    this.setupContentWidth(this.body);
  }

  private setupBackgroundImage(layoutJson: IRow): void {
    this.backgroundImage = layoutJson.values.backgroundImageUrl ? `url(${layoutJson.values.backgroundImageUrl})` : '';
  }

  /**
   * In case row in rendered directly inside body then we have body value and width setup.
   * @param body
   */
  private setupContentWidth(body: IBody | undefined): void {
    this.contentWidth = body ? body.values.contentWidth + 'px' : '100%';
  }

}
