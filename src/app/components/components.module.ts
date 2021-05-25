import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SelectImageComponent } from '../components/select-image/select-image.component';
import { FollowButtonComponent } from '../components/follow-button/follow-button.component';
import { FlipComponent } from '../components/camera/flip/flip.component';
import { FlashComponent } from '../components/camera/flash/flash.component';
import { RecordComponent } from '../components/camera/record/record.component';
import { HideComponent } from '../components/camera/hide/hide.component';
import { GalleryRollCardComponent } from '../components/gallery-roll-card/gallery-roll-card.component';

@NgModule({
  declarations: [
    SelectImageComponent, FollowButtonComponent, FlipComponent, FlashComponent,
    RecordComponent, HideComponent, GalleryRollCardComponent
  ],
  exports: [
     SelectImageComponent, FollowButtonComponent, FlipComponent, FlashComponent,
     RecordComponent, HideComponent, GalleryRollCardComponent,
  ],
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class ComponentsModule { }           