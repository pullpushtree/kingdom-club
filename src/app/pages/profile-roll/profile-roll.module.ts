import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileRollPageRoutingModule } from './profile-roll-routing.module';

import { ProfileRollPage } from './profile-roll.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileRollPageRoutingModule
  ],
  declarations: [ProfileRollPage]
})
export class ProfileRollPageModule {}
