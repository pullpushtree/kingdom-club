import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SetProfileImagesPageRoutingModule } from './set-profile-images-routing.module';

import { SetProfileImagesPage } from './set-profile-images.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SetProfileImagesPageRoutingModule
  ],
  declarations: [SetProfileImagesPage]
})
export class SetProfileImagesPageModule {}
