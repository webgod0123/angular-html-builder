import { Component, Input } from '@angular/core';
import { AAGUID } from '@interticket/core';

@Component({
  selector: 'component-card',
  templateUrl: './component-card.component.html',
  styleUrls: ['./component-card.component.scss'],
})
export class ComponentCardComponent {

  @Input() src: string;
  @Input() label: string;
  @Input() selected: boolean;
  @Input() hasImage: boolean;
  @Input() id: AAGUID;

  constructor() {
    this.selected = false;
    this.hasImage = false;
  }

  get backgroundImageStyle() {
    return this.src && this.hasImage ? `url(${this.src})` : 'url(/assets/placeholder.png)';
  }

}
