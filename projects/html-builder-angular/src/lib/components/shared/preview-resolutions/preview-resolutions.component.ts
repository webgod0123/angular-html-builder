import { Component } from '@angular/core';
import { Responsive } from '../../../enums';
import { IResolution } from '../../../interfaces';

@Component({
  selector: 'preview-resolutions',
  templateUrl: './preview-resolutions.component.html',
  styleUrls: ['./preview-resolutions.component.scss'],
})

export class PreviewResolutionsComponent {

  resolutions: IResolution[] = [
    { type: Responsive.DESKTOP, label: '1152px', name: 'MacBook', value: 1152 },
    { type: Responsive.DESKTOP, label: '1440px', name: 'MacBook Pro', value: 1440 },
    { type: Responsive.DESKTOP, label: '1500px', name: 'Surface Book', value: 1500 },
    { type: Responsive.DESKTOP, label: '1280px', name: 'iMac', value: 1280 },
    { type: Responsive.TABLET, label: '768px', name: 'iPad Mini', value: 768 },
    { type: Responsive.TABLET, label: '834px', name: 'iPad Pro 11"', value: 834 },
    { type: Responsive.TABLET, label: '1024px', name: 'iPad Pro 12.9"', value: 1024 },
    { type: Responsive.TABLET, label: '1368px', name: 'Surface Pro 4', value: 1368 },
    { type: Responsive.MOBILE, label: '414px', name: 'iPhone 11 Pro Max', value: 414 },
    { type: Responsive.MOBILE, label: '375px', name: 'iPhone 11 Pro/X', value: 375 },
    { type: Responsive.MOBILE, label: '411px', name: 'Google Pixel 2', value: 411 },
    { type: Responsive.MOBILE, label: '360px', name: 'Android', value: 360 },
  ];

  activeResolution: IResolution;

  constructor() {
    this.activeResolution = this.resolutions[3];
  }

  setActiveResolution(resolution: IResolution) {
    this.activeResolution = resolution;
  }

  setDesktop() {
    this.activeResolution = this.resolutions[3];
  }

  setTablet() {
    this.activeResolution = this.resolutions[4];
  }

  setMobile() {
    this.activeResolution = this.resolutions[this.resolutions.length - 1];
  }

  isDesktop() {
    return this.activeResolution.type === Responsive.DESKTOP;
  }

  isTablet() {
    return this.activeResolution.type === Responsive.TABLET;
  }

  isMobile() {
    return this.activeResolution.type === Responsive.MOBILE;
  }

}
