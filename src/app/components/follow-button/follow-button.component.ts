import { Component, OnInit, Input } from '@angular/core';
import { FollowService } from "../../services/follow.service"
import { size } from "lodash";

@Component({
  selector: 'app-follow-button',
  templateUrl: './follow-button.component.html',
  styleUrls: ['./follow-button.component.scss'],
})
export class FollowButtonComponent implements OnInit {
  @Input() user;
  @Input() currentUser;

  followerCount: number;
  isFollowing: boolean;
  image = "../../../assets/images/defaultProfile.png"

  followers;
  following;
  followingCount: any;

  constructor(
    private followSvc: FollowService
    ) { }

  ngOnInit() {

    const userId = this.user.uid
    const currentUserId = this.currentUser.user.uid

    this.following = this.followSvc.getFollowing(currentUserId, userId)
    .then(following => {      
      this.isFollowing = following.exists
      this.followingCount = this.countFollowing(following)
    })

    this.followers = this.followSvc.getFollowers(currentUserId)
    .subscribe(followers => {
     this.followerCount = this.countFollowers(followers)
    })
  } 

  countFollowers(followers) {
    if(followers.$value === null) return 0
    else     
    console.log("number of followers : ", size(followers))
    return size(followers)
  }

  countFollowing(following) {
    if(following.$value === null) return 0
    else     
    console.log("number of following : ", size(following))
    return size(following)
  }

  toggleFollow(){
    const userId = this.user.uid
    const currentUserId = this.currentUser.user.uid

    if(this.isFollowing) {
      this.followSvc.unfollow(currentUserId, userId)
      this.isFollowing = false      
    } else {
      this.followSvc.follow(currentUserId, userId)
      this.isFollowing = true      
    }
  } 
}
