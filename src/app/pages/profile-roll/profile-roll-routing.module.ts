import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileRollPage } from './profile-roll.page';

const routes: Routes = [
  {
    path: '',
    component: ProfileRollPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRollPageRoutingModule {}
