import { Component, OnInit } from "@angular/core";
import { AngularFirestore, DocumentSnapshot } from "@angular/fire/firestore";
import { AngularFireStorage } from "@angular/fire/storage";
import { Router } from "@angular/router";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import {
  LoadingController,
  AlertController,
  ToastController,
} from "@ionic/angular";
import { Observable } from "rxjs";
import { ProfileSetupService } from "src/app/services/profile-setup.service";
import { AuthConstants } from "../../config/auth-constant";
import { MediaService } from "../../services/media.service";

@Component({
  selector: "app-set-profile-images",
  templateUrl: "./set-profile-images.page.html",
  styleUrls: ["./set-profile-images.page.scss"],
})
export class SetProfileImagesPage implements OnInit {
  currentUser: any;
  
  image = "../../../assets/images/defaultProfile.jpg"; 
  imagePath: string;
  imageUpload: any;
  userData: any;
  
  constructor(
    public camera: Camera,
    private router: Router,
    private media: MediaService,
    private profSrv : ProfileSetupService
  ) {
    this.currentUser = JSON.parse(localStorage.getItem(AuthConstants.AUTH)).user;    
  }

  ngOnInit() {
    this.getProfileImage();
  }
  
  ionViewWillEnter() {
    this.userData = this.profSrv.getUser(this.currentUser.uid)
    .subscribe(res => {
      this.userData = res;
    });
  }

  async addPhotoAction(source: string) {
    this.media.takeCameraOrLibraryPhoto(source)    
  }

  async completeUploadToFirebaseAction() {
    this.userData = this.profSrv.getUser(this.currentUser.uid)
    .subscribe(res => {    
      this.userData = res
       this.media.setUserPhotoURLDisplayName(this.userData.displayName, this.userData.photoURL)
       .then( () => this.router.navigate(["/home/settings"]))          
      .catch(error => console.dir(error))      
    });
  }

  async getProfileImage(){
    this.profSrv.getProfileImage();
  }
}
