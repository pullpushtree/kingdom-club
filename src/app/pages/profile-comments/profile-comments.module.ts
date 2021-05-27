import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileCommentsPageRoutingModule } from './profile-comments-routing.module';

import { ProfileCommentsPage } from './profile-comments.page';

import { ComponentsModule } from 'src/app/pipes/pipe.module';

@NgModule({
  imports: [    
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileCommentsPageRoutingModule,
    ComponentsModule    
  ],
  declarations: [ProfileCommentsPage ] 
})
export class ProfileCommentsPageModule {}
