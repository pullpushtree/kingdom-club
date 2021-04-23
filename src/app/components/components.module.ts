import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SelectImageComponent } from '../components/select-image/select-image.component';
import { FollowButtonComponent } from '../components/follow-button/follow-button.component';

@NgModule({
  declarations: [
    SelectImageComponent, FollowButtonComponent
  ],
  exports: [
     SelectImageComponent, FollowButtonComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class ComponentsModule { }           