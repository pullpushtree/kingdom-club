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

  image = "../../assets/images/defaultProfile.jpg"
  imagePath: string;
  imageUpload: any;

  picData: any;
  imgURL: any;

  profilePic1: string;
  profilePic2: string;
  profilePic3: string;
  profilePic4: string;
  profilePic5: string;
  profilePic6: string;
  
  constructor(
    private camera: Camera,
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
    })

  } 

  async upload(){    
    const getImageSlot = localStorage.getItem('picSelectedHolder');  

    this.imagePath = `profilePicture/${this.currentUser.uid}_`+ new Date().getTime() +'.jpg';
    await this.afStore.ref(this.imagePath).putString(this.picData, 'data_url')
      .then((snapshot) => {
        const dwnldURL = snapshot.ref.getDownloadURL();
        dwnldURL.then(res => {
          this.imgURL = res;
          if(getImageSlot == 'mainProfilePic'){
            //update firebase object user photoURL value
            this.afauthSrv.updateUserProfileImage(this.imgURL)
            this.afs.collection("users").doc(this.currentUser.uid)
            .set({
              photoURL : this.imgURL,               
            })
          }
          else if (getImageSlot == 'profilePic1') 
          {
            localStorage.setItem('profilePic1', this.imgURL)  
            this.profilePic1 = this.imgURL;
             
             this.afs.collection("users").doc(this.currentUser.uid)
             .set({ 
              profilePic1 : this.imgURL,
              profilePics: { profilePic1 : this.imgURL }             
              
              }, {merge : true})  
           } 
           else if (getImageSlot == 'profilePic2') 
           {
            localStorage.setItem('profilePic2', this.imgURL)  
            this.profilePic2 = this.imgURL;
            this.afs.collection("users").doc(this.currentUser.uid)
            .set({ 
              profilePic2 : this.imgURL,
              profilePics: { profilePic2 : this.imgURL }
              
             }, {merge : true})  
           } 
           else if (getImageSlot == 'profilePic3') 
           {
            localStorage.setItem('profilePic3', this.imgURL)  
            this.profilePic3 = this.imgURL;
            
            this.afs.collection("users").doc(this.currentUser.uid)
            .set({ 
              profilePic3 : this.imgURL,
              profilePics: { profilePic3 : this.imgURL }
              
             },  {merge : true})
           } 
           else if (getImageSlot == 'profilePic4') 
           {
            localStorage.setItem('profilePic4', this.imgURL)  
            this.profilePic4 = this.imgURL;
            
            this.afs.collection("users").doc(this.currentUser.uid)
            .update({ 
              profilePic4 : this.imgURL,
              profilePics: { profilePic4 : this.imgURL }            
             })
             
           } 
           else if (getImageSlot == 'profilePic5') 
           {
            localStorage.setItem('profilePic5', this.imgURL)  
            this.profilePic5 = this.imgURL;
            
            this.afs.collection("users").doc(this.currentUser.uid)
            .update({ 
              profilePic5 : this.imgURL,
              profilePics: { profilePic5 : this.imgURL }            
             })
           } 
           else if (getImageSlot == 'profilePic6') 
           {
            localStorage.setItem('profilePic6', this.imgURL)  
            this.profilePic6 = this.imgURL;           
            
            this.afs.collection("users").doc(this.currentUser.uid)
            .update({ 
              profilePic6 : this.imgURL,
              profilePics: { profilePic6 : this.imgURL }             
             })
           }
           else 
           {
             console.log("error profilePic selected slot didn't work. Try again")
             return;
           }           
          }).catch((error) => {
            console.error(error);
          });
    }).catch((error) => {
        console.dir(error)
    });
  } 

  async takeCameraOrLibraryPhoto(source: string) {
    if (source === "library") {
      await this.openLibrary()
      .then((imgData) => {
        this.picData = "data:image/jpg;base64," + imgData;         
      }).catch((error) => {
        console.dir(error);
      });
    } else {
      await this.openCamera()
      .then((imgData) => {   
        console.log("M3 media.service.ts takeCameraOrLibraryPhoto CAMERA imgData value : ", imgData)      
        this.picData = "data:image/jpg;base64," + imgData; 
        console.log("M4 media.service.ts takeCameraOrLibraryPhoto CAMERA >>> PICDATA value : ", this.picData)        
        //this.upload();
      }).catch((error) => {
        console.log(error)
      });
    }
  }

  async openLibrary() {
    const options: CameraOptions = {
      quality: 85,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetHeight: 1000,
      targetWidth: 1000,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    };
    return await this.camera.getPicture(options)
    .catch(error =>
      {
        console.dir(error)
      });
  }

  async openCamera() {
    const options: CameraOptions = {
      quality: 85,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetHeight: 500,
      targetWidth: 500,
      sourceType: this.camera.PictureSourceType.CAMERA,
      correctOrientation: true,
      cameraDirection: 0,
    };
    return await this.camera.getPicture(options)
    .catch(error =>
      {
        console.dir(error)
      });
  } 


  async  updateFirebasePhotoURL(URLv: string){
    return await this.afauthSrv.updateUserProfileImage(URLv)
  }

  async setUserPhotoURLDisplayName(dispNam, imgURL){
    return this.afauthSrv.updatePhotoURLAndUsername( dispNam, imgURL);
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
        res.task.snapshot.ref
          .getDownloadURL()
          .then((downloadableURL) => {
            //update user collection
            const tempDownloadbleURL = downloadableURL;
            console.log("M5 media.service.ts uploadFirebase() then downloadebleURL value : ", tempDownloadbleURL)            
            //update firebase user 
            this.updateFirebasePhotoURL(tempDownloadbleURL);

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
                console.error(error);
              });
          })
          .catch((error) => {
            loading.dismiss();
            this.toast(error.message, "danger");
            console.error(error);
          });
      })
      .catch((error) => {
        loading.dismiss();
        this.toast(error.message, "danger");
        console.error(error);
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

  async delete(){
    const getImageSlot = localStorage.getItem('picSelectedHolder');      

    if(getImageSlot == 'profilePic1'){
      localStorage.setItem('profilePic1', '')  
       this.profilePic1 = this.image; 
       this.afs.collection("users").doc(this.currentUser.uid)
       .set({ 
        profilePic1 : '',
        profilePics: { profilePic1 : '' }
        
        }, {merge:true})  
     } 
     else if (getImageSlot == 'profilePic2') 
     {
      localStorage.setItem('profilePic2', '')  
      this.profilePic2 = this.image;            
      
      this.afs.collection("users").doc(this.currentUser.uid)
      .set({ 
        profilePic2 : '',
        profilePics: { profilePic2 : '' }        
       }, {merge:true})  
     } 
      
     else if (getImageSlot == 'profilePic3') 
     {
      localStorage.setItem('profilePic3', '')  
      this.profilePic3 = this.image;            
      
      this.afs.collection("users").doc(this.currentUser.uid)
      .set({ 
        profilePic3 : '',
        profilePics: { profilePic3 : '' }        
       }, {merge:true})  
     } 
      
     else if (getImageSlot == 'profilePic4') 
     {
      localStorage.setItem('profilePic4', '')  
      this.profilePic4 = this.image;           
     
      this.afs.collection("users").doc(this.currentUser.uid)
      .update({ 
        profilePic4 : '',
        profilePics: { profilePic4 : '' },
        
       })  
     } 
      
     else if (getImageSlot == 'profilePic5') 
     {
      localStorage.setItem('profilePic5', '')  
      this.profilePic5 = this.image;            
      
      this.afs.collection("users").doc(this.currentUser.uid)
      .update({ 
        profilePic5 : '',
        profilePics: { profilePic5 : '' },
        
       })  
     }  
     else if (getImageSlot == 'profilePic6') 
     {
      localStorage.setItem('profilePic6', '')  
      this.profilePic6 = this.image;            
     
      this.afs.collection("users").doc(this.currentUser.uid)
      .update({ 
        profilePic6 : '',
        profilePics: { profilePic6 : '' },
        
       })  
     } 
  }
}

