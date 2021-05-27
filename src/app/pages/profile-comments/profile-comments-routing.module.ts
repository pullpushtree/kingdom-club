import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileCommentsPage } from './profile-comments.page';

const routes: Routes = [
  {
    path: '',
    component: ProfileCommentsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileCommentsPageRoutingModule {}
