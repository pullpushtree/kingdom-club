import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PromptsPageRoutingModule } from './prompts-routing.module';

import { PromptsPage } from './prompts.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PromptsPageRoutingModule
  ],
  declarations: [PromptsPage]
})
export class PromptsPageModule {}
