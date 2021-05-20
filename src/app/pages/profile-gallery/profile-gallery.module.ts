import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileGalleryPageRoutingModule } from './profile-gallery-routing.module';

import { ProfileGalleryPage } from './profile-gallery.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileGalleryPageRoutingModule
  ],
  declarations: [ProfileGalleryPage]
})
export class ProfileGalleryPageModule {}
