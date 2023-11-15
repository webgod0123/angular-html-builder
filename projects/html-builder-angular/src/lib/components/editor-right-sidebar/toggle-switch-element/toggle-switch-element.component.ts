import { Component, Input } from '@angular/core';

@Component({
  selector: 'toggle-switch-element',
  templateUrl: './toggle-switch-element.component.html',
  styleUrls: ['./toggle-switch-element.component.scss'],
})

export class ToggleSwitchElementComponent {

  @Input() value: boolean;
  @Input() label: string;

}
