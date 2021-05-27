import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from 'src/app/pipes/pipe.module';

import { ChatsPageRoutingModule } from './chats-routing.module';

import { ChatsPage } from './chats.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatsPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ChatsPage]
})
export class ChatsPageModule {}
