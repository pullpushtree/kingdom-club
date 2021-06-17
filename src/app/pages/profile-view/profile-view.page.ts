import { Component, OnInit, Input } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ProfileSetupService } from "src/app/services/profile-setup.service";
import { FollowService } from "../../services/follow.service";

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

  image = "../../../assets/images/defaultProfile.jpg";

  isFollowing: boolean;
  following;

  constructor(
    private router: Router,
    private afauthSrv: AuthService,
    private profileSrv: ProfileSetupService,
    private activatedRoute: ActivatedRoute,
    private followSvc: FollowService
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


  likeBtn() {
    console.log("like button was clicked");
  }
}
