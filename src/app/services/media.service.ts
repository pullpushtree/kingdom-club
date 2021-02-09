import { Injectable } from "@angular/core";
import { AuthConstants } from "./../config/auth-constant";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireStorage } from "@angular/fire/storage";
import { Router } from "@angular/router";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import {
  LoadingController,
  AlertController,
  ToastController,
  PopoverController,
} from "@ionic/angular";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class MediaService {
  currentUser: any;

  photos: any[] = [];
  base64Image: string;
  image = "https://dummyimage.com/300";
  imagePath: string;
  imageUpload: any;


  profilePic1: string;
  profilePic2: string;
  profilePic3: string;
  profilePic4: string;
  profilePic5: string;
  profilePic6: string;

  constructor(
    public camera: Camera,
    private loadingCtrl: LoadingController,
    private router: Router,
    private afauthSrv: AuthService,
    private afs: AngularFirestore,
    private afStore: AngularFireStorage,
    private alert: AlertController,
    private toastr: ToastController,
    private popover: PopoverController
  ) {
    this.afauthSrv.user$.subscribe((user) => {
      this.currentUser = user; 
      console.log("media.service.ts constructor", this.currentUser)      
      this.profilePic1 = this.currentUser.photoURL
    })

  }

  async addPhoto(source: string) {
    if (source === "library") {


      const libraryImage = await this.openLibrary();
      this.base64Image = "data:image/jpg;base64," + libraryImage;

      const getImageSlot = localStorage.getItem('picSelectedHolder');
      this.checkPicPlacehodlerSlot(getImageSlot)      
      //this.popover.dismiss();
      
    } else {
      const cameraPhoto = await this.openCamera();
      this.base64Image = "data:image/jpg;base64," + cameraPhoto;           
      
      const getImageSlot = localStorage.getItem('picSelectedHolder');
      this.checkPicPlacehodlerSlot(getImageSlot)
    }
  }
  async checkPicPlacehodlerSlot(slot: string){

    const getImageSlot = slot
    try {
      if (getImageSlot == 'profilePic1'){        
        await this.afs.doc(`users/${this.currentUser.uid}`)
        .update({           
          photoURL : this.base64Image,
          profilePic1 : this.base64Image
        })

        if(this.currentUser.profilePic1 != null || this.currentUser.profilePic1 != undefined ){         
          this.profilePic1 = this.currentUser.profilePic1         
        } else {         
          this.profilePic1 = this.base64Image;
        }        
        this.popover.dismiss(); 
      } 
      else if (getImageSlot == 'profilePic2'){
        this.afs.doc(`users/${this.currentUser.uid}`)
        .update({ profilePic2 : this.base64Image})        

        if(this.currentUser.profilePic2 != null || this.currentUser.profilePic2 != undefined ){
          this.profilePic2 = this.currentUser.profilePic2
        } else {          
          this.profilePic2 = this.base64Image;
        }        
        this.popover.dismiss();
      } 
      else if (getImageSlot == 'profilePic3')
      {        
        this.afs.doc(`users/${this.currentUser.uid}`)
        .update({ profilePic3 : this.base64Image})

        if(this.currentUser.profilePic3 != null || this.currentUser.profilePic3 != undefined ){         
          this.profilePic3 = this.currentUser.profilePic3
        } else {          
          this.profilePic3 = this.base64Image;
        }
        this.popover.dismiss()
      } 
      else if (getImageSlot == 'profilePic4'){        
        this.afs.doc(`users/${this.currentUser.uid}`)
        .update({ profilePic4 : this.base64Image})

        if(this.currentUser.profilePic4 != null || this.currentUser.profilePic4 != undefined ){          
          this.profilePic4 = this.currentUser.profilePic4
        } else {          
          this.profilePic4 = this.base64Image;
        }
        this.popover.dismiss()        
      } 
      else if (getImageSlot == 'profilePic5'){
        this.afs.doc(`users/${this.currentUser.uid}`)
        .update({ profilePic5 : this.base64Image})

        if(this.currentUser.profilePic5 != null || this.currentUser.profilePic5 != undefined ){          
          this.profilePic5 = this.currentUser.profilePic5
        } else {          
          this.profilePic5 = this.base64Image;
        }
        this.popover.dismiss()        
      } 
      else if (getImageSlot == 'profilePic6'){
        this.afs.doc(`users/${this.currentUser.uid}`)
        .update({ profilePic6 : this.base64Image})

        if(this.currentUser.profilePic6 != null || this.currentUser.profilePic6 != undefined ){          
          this.profilePic6 = this.currentUser.profilePic6
        } else {          
          this.profilePic6 = this.base64Image;
        }
        this.popover.dismiss()        
      }
      else {
        this.popover.dismiss()
        console.log("COULDNT GET SLOT FROM LOCAL STORAGE. SOMETHING WENT WRONG")
      }
    } 
    catch {
      this.popover.dismiss()
      console.log("COULDNT SAVE IMAGE. SOMETHING WENT WRONG")
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
            this.afs
              .collection("users")
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

