import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DateAgoPipe } from 'src/app/pipes/date-ago.pipe';

@NgModule({
  declarations: [
    DateAgoPipe
  ],
  exports: [
    DateAgoPipe
  ],
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class ComponentsModule { }    