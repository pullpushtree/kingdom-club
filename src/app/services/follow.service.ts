import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from "@angular/fire/firestore";
import { size } from "lodash";

@Injectable({
  providedIn: 'root'
})
export class FollowService {
  userId: string
  currentUserId: string
  currentUserData : any;

  followerCount: number;
  isFollowing: boolean;

  constructor(
    private afAuth: AngularFireAuth,    
    private afs: AngularFirestore,
  ) {

    this.afAuth.authState.subscribe(user => {
      if(user)       
      this.currentUserData = user
      this.currentUserId = user.uid;      
    })
   }

   getCurrentUser(){
    if(this.currentUserData !== null){      
      return this.currentUserData
    }
   }

  getFollowers(followers) {     
    return this.afs.collection(`contacts/${this.currentUserId}/followers`) 
    .valueChanges(followers => {      
      this.followerCount = this.countFollowers(followers)
      this.isFollowing = followers.$value      
    })    
  }

  countFollowers(followers) {
    if(followers.$value === null) return 0
    else return size(followers)
  }

  async getFollowing(followerId: string, followedId: string){  
    return  await this.afs.doc(`contacts/${followerId}/following/${followedId}`).ref.get() 
  }

  follow(followerId: string, followedId: string){    
    this.afs.doc(`contacts/${followerId}/following/${followedId}`).set( { [followedId]: true}, {merge : true})
    this.afs.doc(`contacts/${followedId}/followers/${followerId}`).set( { [followerId]: true}, {merge : true} )  
}

  unfollow(followerId: string, followedId: string){
    this.afs.doc(`contacts/${followerId}/following/${followedId}`).delete()
    this.afs.doc(`contacts/${followedId}/followers/${followerId}`).delete()
  }
}
