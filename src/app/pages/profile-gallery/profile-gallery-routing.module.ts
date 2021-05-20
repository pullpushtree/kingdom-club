import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileGalleryPage } from './profile-gallery.page';

const routes: Routes = [
  {
    path: '',
    component: ProfileGalleryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileGalleryPageRoutingModule {}
