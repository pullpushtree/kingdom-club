import { Component, OnInit } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from "@angular/fire/firestore";
import { AngularFireStorage } from "@angular/fire/storage";
import { Router } from "@angular/router";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import {
  LoadingController,
  AlertController,
  ToastController,
} from "@ionic/angular";
import { AuthConstants } from "../../config/auth-constant";

@Component({
  selector: "app-set-profile-images",
  templateUrl: "./set-profile-images.page.html",
  styleUrls: ["./set-profile-images.page.scss"],
})
export class SetProfileImagesPage implements OnInit {
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
    private toastr: ToastController
  ) {}

  ngOnInit() {}

  async addPhoto(source: string) {
    if (source === "library") {
      const libraryImage = await this.openLibrary();
      this.image = "data:image/jpg;base64," + libraryImage;
    } else {
      const cameraPhoto = await this.openCamera();
      this.image = "data:image/jpg;base64," + cameraPhoto;
    }
  }

  async openLibrary() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetHeight: 1000,
      targetWidth: 1000,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    };
    return await this.camera.getPicture(options);
  }

  async openCamera() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetHeight: 500,
      targetWidth: 500,
      sourceType: this.camera.PictureSourceType.CAMERA,
      correctOrientation: true,
      cameraDirection: 0,
    };
    return await this.camera.getPicture(options);
  }

  async uploadFirebase() {
    const currentUser = JSON.parse(localStorage.getItem(AuthConstants.AUTH));
    const loading = await this.loadingCtrl.create({
      message: "Please wait..",
      spinner: "crescent",
      showBackdrop: true,
    });
    await loading.present();

    this.imagePath = new Date().getTime() + ".jpg";

    //save image to afstorage
    this.imageUpload = await this.afStore
    .ref(this.imagePath)
    .putString(this.image, "data_url")
    .then((res) => {
      const imageFile = res.task.snapshot.ref
      .getDownloadURL()
      .then((downloadableURL) => {
        //update user collection
        const tempDownloadbleURL = downloadableURL;
        this.afs.collection("users")
        .doc(currentUser.user.uid)
        .update({ photoURL: tempDownloadbleURL })
        .finally(async () => {
          await loading.dismiss();
          const alert = await this.alert.create({
            header: "Success",
            message: "Your image was saved",
            buttons: ["OK"],
          });
          await alert.present().then(() => {
            this.router.navigate(["home/profile"]);
          });
        })
        .catch((error) => {
          loading.dismiss();
          this.toast(error.message, "danger");
          console.dir(error);
        });
      })
      .catch((error) => {          
        loading.dismiss();
        this.toast(error.message, "danger");
        console.dir(error);
      });
    })
    .catch((error) => {        
      loading.dismiss();
      this.toast(error.message, "danger");
      console.dir(error);
    });
  }

  async toast(message, status) {
    const toast = await this.toastr.create({
      message: message,
      position: "bottom",
      color: status,
      duration: 2000,
    });
    toast.present();
  }
}
