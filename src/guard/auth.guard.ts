import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { HintTools } from 'src/providers/HintTools';
import { AuthService } from '../providers/utils/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  CONSOLE_TAG = 'AuthGuard';

  constructor(private authService: AuthService, public hint: HintTools, public translate: TranslateService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let msg = this.translate.instant('GuardInfo.NoAuth');
    if (!this.authService.getToken()) {
      this.hint.presentToast({ message: msg });
      return false;
    }
    return true;
  }
}
