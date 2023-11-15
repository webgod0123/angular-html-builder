import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ConfigType } from '../enums/config-type.enum';

@Injectable()
export class BuilderInterfaceService {

  private rightMenuOpen = new BehaviorSubject(true);
  public rightMenuOpen$ = this.rightMenuOpen.asObservable();

  private configType = new BehaviorSubject(ConfigType.Body);
  public configType$ = this.configType.asObservable();

  private leftMenuOpen = new BehaviorSubject(true);
  public leftMenuOpen$ = this.leftMenuOpen.asObservable();

  private isSmallLeftMenu = new BehaviorSubject(true);
  public isSmallLeftMenu$ = this.isSmallLeftMenu.asObservable();

  private hasSubLeftMenu = new BehaviorSubject(false);
  public hasSubLeftMenu$ = this.hasSubLeftMenu.asObservable();

  openLeftMenu() {
    const leftMenuOpen = this.leftMenuOpen.getValue();

    this.leftMenuOpen.next(!leftMenuOpen);
  }

  setIsSmallLeftMenu(open: boolean) {
    this.isSmallLeftMenu.next(open);
  }

  setHasSubLeftMenu(open: boolean) {
    this.hasSubLeftMenu.next(open);
  }

  openContentConfig() {
    this.configType.next(ConfigType.Content);
    this.rightMenuOpen.next(true);
  }

  openLayoutConfig() {
    this.configType.next(ConfigType.Layout);
    this.rightMenuOpen.next(true);
  }

  openBodyConfig() {
    this.configType.next(ConfigType.Body);
    this.rightMenuOpen.next(true);
  }

  closeConfig() {
    this.rightMenuOpen.next(false);
  }

  toggleConfig() {
    const rightMenuOpen = this.rightMenuOpen.getValue();
    this.rightMenuOpen.next(!rightMenuOpen);
  }

}
