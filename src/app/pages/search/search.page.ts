import {  Component, OnInit, Input, ViewChild} from "@angular/core";
import { Router } from "@angular/router";
import { IonSearchbar } from "@ionic/angular";
import { FollowService } from "src/app/services/follow.service";
import { SearchService } from "src/app/services/search.service";


@Component({
  selector: "app-search",
  templateUrl: "./search.page.html",
  styleUrls: ["./search.page.scss"],
})
export class SearchPage implements OnInit {
  @ViewChild("search", { static: false }) search: IonSearchbar;
  @Input() currentUser: any;
  @Input() otherUser: any = {};
  @Input() otherUserId: string;
  @Input() isFollowing: boolean;

   platformUser: any;
   image = "../../../assets/images/defaultProfile.jpg";
   searchTerm: any;
   followerCount: number;
   list: any = [];
   following: any;
   followers: any;  
   listFollowingUserIds: any[];

  constructor(
    private router: Router,
    private followSvc: FollowService,
    private searchSrvc: SearchService  
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.searchSrvc.getCurrentUser()
    .subscribe((user) => {
      this.currentUser = user;
      this.getListOfUsers();
      this.getListCurrentUserFollowStatus();

      const oUserId = this.otherUser.uid;
      this.following = this.followSvc.getFollowing(
        this.currentUser.uid,
        oUserId
      );
    });
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.search.setFocus();
    });
  }

  async getListCurrentUserFollowStatus() {
    return await this.followSvc
      .getCurrentUserListOfFollowingUsers()
      .forEach((newResultsWithFollowing) => {
        newResultsWithFollowing.map((res) => {
          return (this.listFollowingUserIds = res.followingCandidatId);
        });
      });
  }

  getListOfUsers() {
    let listUSer = [];
    this.followSvc
      .getCurrentUserContactsListOfFollowingUsers()
      .subscribe((res) => {
        res.map((res) => {
          listUSer.push(res["followingCandidatId"]);
        });
      });

    this.list = this.searchSrvc.getUsers().subscribe((users) => {
      listUSer.find((followingUSerId) => {
        users.map((platformUser) => {
          if (platformUser.uid == followingUSerId) {
            this.isFollowing = platformUser.isFollowing = true;
          }
        });
      });

      this.platformUser = users.filter((items: any) => {
        return items.uid !== this.currentUser.uid;
      });
    });

    this.searchTerm = this.list;
  }

  filterList(event) {
    const searchTermInput = event.target.value;
    this.searchTerm = this.platformUser;
    if (searchTermInput && searchTermInput.trim() != "") {
      this.searchTerm = this.searchTerm.filter((item: any) => {
        let test =
          item.displayName
            .toLowerCase()
            .indexOf(searchTermInput.toLowerCase()) > -1 &&
          item.uid !== this.currentUser.uid;

        return test;
      });
    }
  }

  selectedUser(oUserObj){
    console.log("oUserObk ", oUserObj)
    this.followSvc.setSelectedUserToFollow(oUserObj)
  }

  goToSelectedProfile(event: any) {
    const val = event;
    const otherUserData = {
      displayName: val.displayName,
      photoURL: val.photoURL,
      uid: val.uid,
      firstLastName: val.firstLastName,
    };

    this.followSvc.setOtherUserData(otherUserData);
    localStorage.setItem("selectedUserProfileView", val.uid);
    localStorage.setItem(
      "otherUserObjectDetails",
      JSON.stringify(otherUserData)
    );
    this.router.navigate(["home/profile-view/", val.uid]);
  }
}
