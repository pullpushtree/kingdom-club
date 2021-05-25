import { Component, OnInit } from '@angular/core';
import { ProfileSetupService } from 'src/app/services/profile-setup.service';

@Component({
  selector: 'app-profile-roll',
  templateUrl: './profile-roll.page.html',
  styleUrls: ['./profile-roll.page.scss'],
})
export class ProfileRollPage implements OnInit {
  image = "../../../assets/images/logo_square.png";  
  currentUser: any;
  roll: any;  
  
  constructor(
    private profileSetup: ProfileSetupService
  ) { }
  
  ionViewDidEnter(){
    this.profileSetup.getCurrentUser().subscribe(user => {
      this.currentUser = user;
      this.getSelectedRoll();
    });
  }
  
  ngOnInit() { }
  
  getSelectedRoll(){
    this.roll = this.profileSetup.getSelectedRoll();
  }
}
