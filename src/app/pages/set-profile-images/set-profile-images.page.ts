import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireStorage } from "@angular/fire/storage";
import { Router } from "@angular/router";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import {
  LoadingController,
  AlertController,
  ToastController,
} from "@ionic/angular";
import { AuthConstants } from "../../config/auth-constant";
import { MediaService } from "../../services/media.service";

@Component({
  selector: "app-set-profile-images",
  templateUrl: "./set-profile-images.page.html",
  styleUrls: ["./set-profile-images.page.scss"],
})
export class SetProfileImagesPage implements OnInit {
  currentUser: any;
  
  image = "https://dummyimage.com/300";
  imagePath: string;
  imageUpload: any;

  constructor(
    public camera: Camera,
    private loadingCtrl: LoadingController,
    private router: Router,
    private afs: AngularFirestore,
    private afStore: AngularFireStorage,
    private alert: AlertController,
    private toastr: ToastController,
    private media: MediaService,
  ) {}

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem(AuthConstants.AUTH));
    console.log(this.currentUser);
  }

  async addPhotoAction(source: string) {
    this.media.addPhoto(source).then((res) => {
      console.log("addPhotoAction res value  ", res)
    })
  }


  async uploadFirebaseAction() {
    this.media.uploadFirebase().then( (res) => {
      console.log("uploadFirebaseAction res value", res)
    });  
  }
}
