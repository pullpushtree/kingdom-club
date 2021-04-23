import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ProfileSetupService } from 'src/app/services/profile-setup.service';
import { FollowService } from "../../services/follow.service"
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.page.html',
  styleUrls: ['./profile-view.page.scss'],
})
export class ProfileViewPage implements OnInit {
  @Input() currentUser;

  
  selectedUserProfile: any;  
  user:any;
  o_userRef: any;

  image = "../../../assets/images/defaultProfile.png"; 

  isFollowing: boolean;
  following;
  
  constructor( 
    private router: Router,
    private afauthSrv: AuthService,
    private profSrv: ProfileSetupService,
    private followSvc: FollowService

    ) {
          
    }

  ngOnInit() { }

  ionViewDidEnter(){ 
    this.currentUser = JSON.parse(localStorage.getItem("userCredKey"));    
    this.o_userRef = localStorage.getItem("otherUserObjectDetails")
    const o_userId = JSON.parse(this.o_userRef).uid

    this.following = this.followSvc.getFollowing(this.currentUser.uid, o_userId)
    .then(following => {
      this.isFollowing = following.exists
    })
    
    this.selectedUserProfile = this.profSrv.getSelectedUserProfileData(o_userId)
    .subscribe(res => {
      this.selectedUserProfile = res; 
    }) 
  }

  likeBtn(){
    console.log("like button was clicked")
  }


}
