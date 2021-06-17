import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";
import * as firebase from 'firebase';
import { size } from "lodash";
import { Observable, BehaviorSubject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Notifications } from "../models/Notifications";
import { RequestSent } from "../models/RequestSent";

@Injectable({
  providedIn: 'root'
})
export class FollowService {
  currentUserId: string
  currentUser: any;

  followerCount: number;
  isFollowing: boolean;

  private followSource = new BehaviorSubject<boolean>(false);
  currentFollowStatus = this.followSource.asObservable();

  private oUserSource = new BehaviorSubject<string>("");
  currentOtherUserStatus = this.oUserSource.asObservable();
  otherUserDetails: any;
  otherUserData: { 
    photoURL: any; 
    displayName: any; 
    firstLastName: any; 
    uid: any; 
  };

  constructor(
    private afs: AngularFirestore,
    private authService: AuthService,    
  ) {
    this.authService.user$
    .subscribe(res => {
      this.currentUser  = res
    })
  }

  getCurrentUser() {
    return this.authService.user$;
  }

  changeFollow(followStatus: boolean) {
    this.followSource.next(followStatus)
  }
  changeOtherUser(oUser: string){
    this.oUserSource.next(oUser)
  }

  getUsers() {
    return this.afs.collection('users')
    .valueChanges({idField: 'uid'}) as Observable<any[]>;
  }

  async approveFollowRequest(oUserObj: any){
    let otherUserId = oUserObj.requesterId
    let currentUserId = this.currentUser.uid
    
    await this.afs.doc(`contacts/${otherUserId}/following/${currentUserId}`).set( { [currentUserId]: true} )
    await this.afs.doc(`contacts/${otherUserId}/contact/${currentUserId}`).set({       
      uid: this.currentUser.uid,
      createdAt: firebase.default.firestore.Timestamp.now(),
      firstLastName: this.currentUser.firstLastName,
      displayName: this.currentUser.displayName,
      photoURL: this.currentUser.photoURL
    })
    await this.afs.doc(`contacts/${currentUserId}/followers/${otherUserId}`).set( { [otherUserId]: true} )
    await this.afs.doc(`contacts/${currentUserId}/contact/${otherUserId}`)
    .set({
      uid: oUserObj.requesterId,      
      createdAt: firebase.default.firestore.Timestamp.now(),
      firstLastName: oUserObj.requesterFirstLastName,
      displayName: oUserObj.requesterDisplayName,
      photoURL: oUserObj.requesterPhoto
    })
    
    this.removeNotifcation(oUserObj);
    this.sendRequesterApprovalNotification(oUserObj)    
  }

  async sendRequesterApprovalNotification(oUserObj){
    let currentUserId = this.currentUser.uid
    
    await this.afs.doc<Notifications>(`contacts/${oUserObj.requesterId}/notifications/${currentUserId}`)
    .set( {
      contacts: [ currentUserId, oUserObj.requesterId ], 
        approved: true, 
        approvedDate: firebase.default.firestore.Timestamp.now(), 
        hasBeenOpened: true,
        createdAt: firebase.default.firestore.Timestamp.now(), 
        archived : false,
        text: " has approved your follow request!",
        requesterId: currentUserId, 
        requesterPhoto: this.currentUser.photoURL,
        requesterDisplayName: this.currentUser.displayName,
        requesterFirstLastName: this.currentUser.firstLastName
    })
    .catch((error) => {
      //Handle error better with a toast
      console.error("Error removing document: ", error);
    });
  }

  async removeNotifcation(notifificationToDelete){       
    let delRef = this.afs.collection<Notifications>(`contacts/${this.currentUser.uid}/notifications`, ref =>    
    ref.where('contacts', 'array-contains', notifificationToDelete.requesterId)
    )    
    delRef.doc(notifificationToDelete.requesterId).delete()
    .catch((error) => {
      console.error("Error removing document: ", error);
    });
    
  }
  cancelFollowRequest(){
    console.log("cancel got call")
  }

  getCurrentUserContactsListOfFollowingUsers(){
    return this.afs.collection(`contacts/${this.currentUser.uid}/following`)
    .valueChanges({idField: 'followingCandidatId'}) as Observable<any[]>;
  }

  getCurrentUserListOfFollowingUsers() {
    return this.getCurrentUserContactsListOfFollowingUsers().pipe(
      map((listOfFollowingUsers) => {
        listOfFollowingUsers.map(individualFollowingUser => {          
          // set isFollowing to true 
          individualFollowingUser.isFollowing = true; 
        });
        return listOfFollowingUsers;
      })
    );
  }

  getNotifications(){
    let users = [];
    return this.getUsers()
    .pipe(
      switchMap(res => {
        users = res;
        return  this.afs.collection<Notifications>(`contacts/${this.currentUser.uid}/notifications`, ref =>
        ref.where('contacts', 'array-contains', this.currentUser.uid)
        .orderBy('createdAt'))
        .valueChanges() as Observable<Notifications[]>
      })
    );
  }

  setOtherUserData(o_user_data: any){
    this.otherUserDetails = o_user_data
  }

  getOtherUserData(){
    if(this.otherUserDetails != null ){
      return this.otherUserDetails; 
    }
  }

  getFollowers() {  
    return this.afs.collection(`contacts/${this.currentUserId}/followers`) 
    .valueChanges(followers => {      
      this.followerCount = this.countFollowers(followers);
    })    
  }

  countFollowers(followers) {
    if(followers.$value === null) return 0
    else 
    console.log("FOLLOWER COUNT IMPORT VALUE VERIFY followers",followers)
    console.log("FOLLOWER COUNT IMPORT VALUE VERIFY size(followers)",size(followers))
    return size(followers)
  }

  setSelectedUserToFollow(oUserObj : any){
    this.otherUserDetails = oUserObj
  }

   getFollowing(currentUserId: string, oUserId: string){
    return  this.afs.doc(`contacts/${currentUserId}/following/${oUserId}`).ref.get()
  }

  async follow(currentUserId: string, oUserId: any){
    let checkIfIdExist = this.afs.doc<Notifications>(`contacts/${this.currentUser.uid}/notifications/${oUserId.uid}`)
    .ref.get();       
    if(( await checkIfIdExist).exists ){
      await this.afs.doc<Notifications>(`contacts/${oUserId}/notifications/${this.currentUser.uid}`)
      .update({ 
        contacts: [ currentUserId, oUserId ], 
        approved: false, 
        approvedDate: null, 
        hasBeenOpened: false,
        createdAt: firebase.default.firestore.Timestamp.now(), 
        archived : false,
        text: " has sent you a follow request!",
        requesterId: currentUserId, 
        requesterPhoto: this.currentUser.photoURL,
        requesterDisplayName: this.currentUser.displayName,
        requesterFirstLastName: this.currentUser.firstLastName
      })
    } else {
      console.log("CREATE A SENT REQUEST ENTRY FOR SENDER currentUser // CREATE A NOTIFICATION FOR RECEIVER otherUSer")      
      this.afs.doc<RequestSent>(`contacts/${this.currentUser.uid}/requestSent/${oUserId}`)
      .set({
        contacts: [ currentUserId, oUserId ], 
        approved: false, 
        approvedDate: null, 
        hasBeenOpened: false,
        createdAt: firebase.default.firestore.Timestamp.now(), 
        archived : false,
        text: "You sent you a follow request to ",
        requestSentToId: oUserId
      })

      this.afs.doc<Notifications>(`contacts/${oUserId}/notifications/${this.currentUser.uid}`)
      .set({
          contacts: [ currentUserId, oUserId ], 
          approved: false, 
          approvedDate: null, 
          hasBeenOpened: false,
          createdAt: firebase.default.firestore.Timestamp.now(), 
          archived : false,
        text: " has sent you a follow request!",
        requesterId: this.currentUser.uid, 
        requesterPhoto: this.currentUser.photoURL,
        requesterDisplayName: this.currentUser.displayName,
        requesterFirstLastName: this.currentUser.firstLastName

      }) 
    }
}

  async unfollow(currentUserId: string, otherUserId: any){
    await this.afs.doc(`contacts/${currentUserId}/following/${otherUserId}`).delete()
    await this.afs.doc(`contacts/${otherUserId}/followers/${currentUserId}`).delete()
  }
}
