import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { User } from "../models/User";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class ProfileSetupService {
  profData: any;
  profViewData: any;
  profileImg: string;
  gelleryData: any;
  currentUser: any;
  userData: { 
    displayName: string; 
    firstLastName: string; 
    photoURL: string; 
  };

  constructor(
    private afs: AngularFirestore,
    private afauthSrv: AuthService,
  ) {
    this.afauthSrv.user$.subscribe((user) => {
      this.currentUser = user;      
      this.userData = {
        displayName: this.currentUser.displayName,
        firstLastName: this.currentUser.firstLastName,
        photoURL: this.currentUser.photoURL
      }
      console.log("userData : ", this.userData)
    })
  }

  getScrapbookImages() {
    return this.afs.collection(`scrapbook2/${this.currentUser.uid}/album/`)
    .valueChanges({idField: 'uid'}) ;
  }

   deleteSelected(itemsToDelete : any){
    for ( var i = 0; i < itemsToDelete.length; i++){
      let picsIdToDelete = itemsToDelete[i].uid;
      console.log("deleteSelected() CURRENT PICS ID TO DELETE =>  : ", picsIdToDelete);

       for(let imgDelete of picsIdToDelete){
        const colRef = this.afs.collection(`scrapbook2/${this.currentUser.uid}/album/`)
        colRef.doc(picsIdToDelete).delete()
        .catch((error) => {
          console.error("Error removing document: ", error);
        });
      }
      picsIdToDelete = []
    }
  }

  getUserGalleryPictures(){ 
    return this.afs.collection(`scrapbook2/${this.currentUser.uid}/album`, ref => 
    ref.orderBy('dateStamp', 'desc' ))
    .valueChanges();
  }

  getSelectedRoll(){
    return this.afs.collection(`scrapbook2/${this.currentUser.uid}/album`, ref => 
    ref.orderBy('dateStamp', 'desc' ))
    .valueChanges();
  }

  setProfData(profObj: any) {
    this.profData = profObj;
  }

  getProfData() {
    if (this.profData != null) {
      return this.profData;
    }
  }
  
  getSelectedUserProfileData(uid){
    return this.profViewData = this.afs.doc(`users/${uid}`).valueChanges() as Observable<User[]>;
  }

  setProfileImage(profileImageObj: any) {
    this.profileImg = profileImageObj;
  }

  getProfileImage() {
    if (this.profileImg != null) {
      return this.profileImg;
    }
  }

  getUser(uid: string) {
    return this.afs.doc(`users/${uid}`)
      .valueChanges() as Observable<User[]>;
  }
}
