import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '', 
    loadChildren: () => import('./index/index.module').then(m => m.IndexPageModule),
    
  },
  {
    path: '', 
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
    
  },
  {
    path: 'set-profile-images',
    loadChildren: () => import('./pages/set-profile-images/set-profile-images.module').then( m => m.SetProfileImagesPageModule),
    
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
