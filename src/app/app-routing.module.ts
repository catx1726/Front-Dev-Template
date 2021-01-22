import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guard/auth.guard';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'Login',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then((m) => m.FolderPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'Scratch-Card',
    loadChildren: () => import('./scratch-cards/scratch-cards.module').then((m) => m.ScratchCardsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'Index',
    loadChildren: () => import('./index/index.module').then((m) => m.IndexPageModule)
  },
  {
    path: 'Check-List',
    loadChildren: () => import('./check-list/check-list.module').then((m) => m.CheckListPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'Login',
    loadChildren: () => import('./login/login.module').then((m) => m.LoginPageModule)
  },
  {
    path: 'User-Win-List',
    loadChildren: () =>
      import('./page-user-win-list/page-user-win-list.module').then((m) => m.PageUserWinListPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
