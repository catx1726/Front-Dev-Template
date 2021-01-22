import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { NavigationOptions } from '@ionic/angular/providers/nav-controller';
import { MenuController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NavService {
  CONSOLE_TAG = 'nav-service';
  constructor(public nav: NavController, public menu: MenuController) {}

  public go(url: string, options: NavigationOptions) {
    this.nav.navigateForward(url, options);
    console.log(`${this.CONSOLE_TAG} go:`, this.menu);
  }

  public back(url: string, options: NavigationOptions) {
    if (url) {
      this.nav.navigateBack(url, options);
      return;
    }
    this.nav.back();
  }

  public backRoot(url: string, options: NavigationOptions) {
    this.nav.navigateRoot('/Index');
    return;
  }
}
