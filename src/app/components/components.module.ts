import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SelectImageComponent } from '../components/select-image/select-image.component'

@NgModule({
  declarations: [
    SelectImageComponent
  ],
  exports: [
     SelectImageComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class ComponentsModule { }           