import { Component, OnInit, Input } from '@angular/core';
import { FollowService } from "../../services/follow.service"
import { size } from "lodash";
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-follow-button',
  templateUrl: './follow-button.component.html',
  styleUrls: ['./follow-button.component.scss'],
})
export class FollowButtonComponent implements OnInit {
  @Input() otherUser: any;
  @Input() otherUserId: string;
  @Input() currentUser: any;  
  @Input() isFollowing: boolean;

  followerCount: number;
  //isFollowing: boolean;
  image = "../../../assets/images/defaultProfile.jpg"

  followers: any;
  following: any;
  followingCount: any;

  constructor(
    private followSvc: FollowService,
    private searchSrvc: SearchService,
    ) { }

  ngOnInit() { }

  changeFollow(){ 
    this.followSvc.changeFollow(true) 
  }

  ionViewWillEnter(){
    this.followSvc.currentFollowStatus.subscribe(followStatus => {
      
      this.isFollowing = followStatus 
    })
    
      this.searchSrvc.getCurrentUser()
    .subscribe((user) => {
      this.currentUser = user;
      const userId = this.otherUser.uid;
      
      this.following = this.followSvc.getFollowing(this.currentUser, userId)
      .then(following => {
        this.isFollowing = following.exists
        this.followSvc.changeFollow(following.exists)        
        this.followingCount = this.countFollowing(following)
        console.log("COUNT VALUE FOLLOWING COUNT : ", this.followingCount)
      })
      
      this.followers = this.followSvc.getFollowers()
      .subscribe(followers => {
        this.followerCount = this.countFollowers(followers)
      })
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

  toggleFollow(oUserObj : any){
    if(this.isFollowing) {
      this.followSvc.unfollow(this.currentUser.uid, oUserObj.uid)
      this.isFollowing = false  
      this.followSvc.changeFollow(this.isFollowing)
    } else {
      this.followSvc.follow(this.currentUser.uid, oUserObj.uid)
      this.isFollowing = true      
      this.followSvc.changeFollow(this.isFollowing)
    }
  } 
}
