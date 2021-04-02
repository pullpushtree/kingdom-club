import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ProfileSetupService } from 'src/app/services/profile-setup.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.page.html',
  styleUrls: ['./profile-view.page.scss'],
})
export class ProfileViewPage implements OnInit {

  currentUser: any;  
  selectedUserProfile: any;  
  user:any;
  o_userRef: any;

  image = "../../../assets/images/defaultProfile.png"; 
  
  constructor( 
    private router: Router,
    private afauthSrv: AuthService,
    private profSrv: ProfileSetupService,

    ) {
      this.afauthSrv.user$.subscribe(user => {
        this.currentUser = user;
        console.log("this.currentUser value : ", this.currentUser)
      })      
    }

  ngOnInit() { }

  ionViewWillEnter(){    
    this.o_userRef = localStorage.getItem("otherUserObjectDetails")
    const o_user = JSON.parse(this.o_userRef)
    
    this.selectedUserProfile = this.profSrv.getSelectedUserProfileData(o_user.uid)
    .subscribe(res => {
      this.selectedUserProfile = res;      
       console.log("res", res)
    })    
  }

  followProfile(){
    console.log("follow was clicked")
  }

  likeBtn(){
    console.log("like button was clicked")
  }


}
