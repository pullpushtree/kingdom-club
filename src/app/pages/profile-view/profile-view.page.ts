import { Component, OnInit, Input } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ProfileSetupService } from "src/app/services/profile-setup.service";
import { FollowService } from "../../services/follow.service";
import { ChatService } from "src/app/services/chat.service";
import { ToastController } from '@ionic/angular';

@Component({
  selector: "app-profile-view",
  templateUrl: "./profile-view.page.html",
  styleUrls: ["./profile-view.page.scss"],
})
export class ProfileViewPage implements OnInit {
  @Input() currentUser;

  selectedUserProfile: any;
  user: any;
  o_userRef: any;
  newMsgP1 = '' ;
  newMsgP2 = '' ;
  newMsgP3 = '' ;
  newMsgP4 = '' ;
  newMsgP5 = '' ;
  newMsgP6 = '' ;
  newMsgC1 = '' ;
  newMsgC2 = '' ;
  newMsgC3 = '' ;

  image = "../../../assets/images/defaultProfile.jpg";

  isFollowing: boolean;
  following;
  selectedImage: string;

  constructor(
    private router: Router,
    private afauthSrv: AuthService,
    private profileSrv: ProfileSetupService,
    private activatedRoute: ActivatedRoute,
    private chatService: ChatService,
    private followSvc: FollowService,
    private toastr: ToastController,
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.profileSrv.getCurrentUser()
    .subscribe((user) => {
      this.currentUser = user;
      const o_userId = this.activatedRoute.snapshot.paramMap.get("id");

      this.following = this.followSvc
        .getFollowing(this.currentUser.uid, o_userId)
        .then((following) => {
          this.isFollowing = following.exists;
        });

      this.profileSrv.getSelectedUserProfileData(o_userId)
      .subscribe((res) => {
        this.selectedUserProfile = res;
      });
    });
  }


  sendMessage(oUserObj: any, image: string, text: string){   
    
    this.selectedImage = image
    this.chatService.sendSelectedProfileViewUserMessage(oUserObj, text, this.selectedImage)
    .then(()=> {
      this.clearFields()    
      // perhaps a toast confirming message sent       
      this.toast("Message Sent!", "dark");
    }).catch(error =>{
      this.toast("Message Failed!", "danger");
    })
  }
  clearFields(){
    this.newMsgP1 = '' ;
    this.newMsgP2 = '' ;
    this.newMsgP3 = '' ;
    this.newMsgP4 = '' ;
    this.newMsgP5 = '' ;
    this.newMsgP6 = '' ;
    this.newMsgC1 = '' ;
    this.newMsgC2 = '' ;
    this.newMsgC3 = '' ; 
  }

  async toast(message,status){
    const toast = await this.toastr.create({
      message: message,
      position: "bottom",
      color: status, 
      duration: 2000
    });
    toast.present();
  }
}
