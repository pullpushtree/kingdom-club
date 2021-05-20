import { Component, OnInit } from '@angular/core';
import { ProfileSetupService } from 'src/app/services/profile-setup.service';

@Component({
  selector: 'app-profile-roll',
  templateUrl: './profile-roll.page.html',
  styleUrls: ['./profile-roll.page.scss'],
})
export class ProfileRollPage implements OnInit {
  roll: any; 
  image = "../../../assets/images/logo_square.png";
  constructor(
    private gallerySetup: ProfileSetupService
  ) { }

  ngOnInit() {
    this.getSelectedRoll();
  }
  
  getSelectedRoll(){
    this.roll = this.gallerySetup.getSelectedRoll();
  }
}
