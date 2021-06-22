import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { User } from "../models/User";
import { AuthService } from "./auth.service";
import firebase from "firebase/app";
import { ToastController } from '@ionic/angular';

export interface Comment {  
  uid: string;
  createdAt: firebase.firestore.FieldValue;  
  cmmt: string;
  fromName: string;
  fromPhoto: string;
  sentBy: string;
  myMsg: boolean;
}

@Injectable({
  providedIn: "root",
})
export class ProfileSetupService {
  profData: any;
  profViewData: any;
  profileImg: string;
  currentUser: any;

  constructor(
    private afs: AngularFirestore,
    private afauthSrv: AuthService,
    private toastr: ToastController,
  ) {
    this.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
    })
  }

  getPictureComment(picId : string){
    return this.afs.collection(`scrapbook2/${this.currentUser.uid}/album/${picId}/comments`, ref => 
    ref.orderBy('createdAt'))
    .valueChanges() as Observable<Comment[]>;
  }

  async addPictureComment(picId: string, cmmt: any){    
    
    const dataPayload = {      
      createdAt: firebase.firestore.Timestamp.now(),
      cmmt: cmmt,
      fromName: this.currentUser.displayName, 
      fromPhoto: this.currentUser.photoURL, 
      sentBy: this.currentUser.uid      
    }
    
    return await this.afs.collection(`scrapbook2/${this.currentUser.uid}/album/${picId}/comments`)
    .add(dataPayload).then(docRef => {
      this.afs.doc(`scrapbook2/${this.currentUser.uid}/album/${picId}/comments/${docRef.id}`)
      .update({uid : docRef.id })      
    })
    .catch(error => {
      this.toast("Comment failed", "danger");
      console.log(error);
    })
  }

  async toast(message,status){
    const toast = await this.toastr.create({
      message: message,
      position: 'bottom',
      color: status, 
      duration: 2000
    });
    toast.present();
  }

  getCurrentUser(){
    return this.afauthSrv.user$;
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

  toggleHeartRemove(img: any) {
    let selectedImage = this.afs.doc(`scrapbook2/${this.currentUser.uid}/album/${img.uid}`);
      selectedImage.update({
        liked: firebase.firestore.FieldValue.arrayRemove(this.currentUser.uid)    
    });    
  }

  toggleHeartAdd(img: any) {
    let selectedImage = this.afs.doc(`scrapbook2/${this.currentUser.uid}/album/${img.uid}`);
      selectedImage.update({
        liked: firebase.firestore.FieldValue.arrayUnion(this.currentUser.uid)
    });
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

  async saveProfileEdits(submitedValues : any){
    return await this.afs
    .collection("users").doc(`${this.currentUser.uid}`)
    .update(submitedValues)
    .catch(error => {
      console.error(error);
    });    
  }
}
