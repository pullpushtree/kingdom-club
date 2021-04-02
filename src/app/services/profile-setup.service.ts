import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { User } from "../models/User";

@Injectable({
  providedIn: "root",
})
export class ProfileSetupService {
  profData: any;
  profViewData: any;
  profileImg: string;

  constructor(
    private afs: AngularFirestore,
  ) {}

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

  getUser(uid) {
    return this.afs.doc(`users/${uid}`)
      .valueChanges() as Observable<User[]>;
  }
}
