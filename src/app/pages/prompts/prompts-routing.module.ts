import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PromptsPage } from './prompts.page';

const routes: Routes = [
  {
    path: '',
    component: PromptsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PromptsPageRoutingModule {}
