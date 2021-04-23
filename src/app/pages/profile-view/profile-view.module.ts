import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileViewPageRoutingModule } from './profile-view-routing.module';

import { ProfileViewPage } from './profile-view.page';
import { ComponentsModule } from '../../components/components.module';
import { Routes } from "@angular/router";

const routes: Routes = [
  {
    path: '',
    component: ProfileViewPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    ProfileViewPageRoutingModule
  ],
  declarations: [ProfileViewPage]
})
export class ProfileViewPageModule {}
