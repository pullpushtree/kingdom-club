import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SetProfileImagesPage } from './set-profile-images.page';

const routes: Routes = [
  {
    path: '',
    component: SetProfileImagesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetProfileImagesPageRoutingModule {}
