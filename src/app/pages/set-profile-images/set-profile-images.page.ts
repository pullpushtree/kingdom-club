import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { LoadingController, AlertController } from '@ionic/angular';

import * as firebase from 'firebase/app';
import { error } from 'protractor';
import { Observable } from 'rxjs';
import { firebaseConfig } from 'src/app/app.module';

@Component({
  selector: 'app-set-profile-images',
  templateUrl: './set-profile-images.page.html',
  styleUrls: ['./set-profile-images.page.scss'],
})
export class SetProfileImagesPage implements OnInit {

  url: string;
  public static URL;
  imgURL;
  imgURL0;
  imgURL1;
  imgURL2;
  imgURL3;
  imgURL4;
  selectedPhoto;
  base64Image: string;
  public static loading; 
  selectedFile = null;



  //public imagePath;  
  public message: string;

  file:File;
  urls = [];
  photos: any=[];

  // new attemp start



  // new attempt end
  image = 'https://dummyimage.com/300';
  imagePath: string;
  upload: any;
  captureDataUrl: string;

  

  constructor(
    public camera: Camera, 
    private loadingCtrl: LoadingController,
    private router: Router,
    private afs: AngularFirestore,
    private afSG: AngularFireStorage,
    private alert: AlertController
    
    ) { 
     // !firebase.apps.length?firebase.initializeApp(firebaseConfig):firebase.app();
    }
    
  ngOnInit() {
  }

// addPhoto()  = takePicture()



async addPhoto(source: string){
  if( source === 'library'){
    const libraryImage = await this.openLibrary();
    this.image = 'data:image/jpg;base64,' + libraryImage;
  } else {
    const cameraPhoto = await this.openCamera();
    this.image = 'data:image/jpg;base64,' + cameraPhoto;
  }
}


async openLibrary(){
  const options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    targetHeight: 1000,
    targetWidth: 1000,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,   

    // saveToPhotoAlbum: true,
    // allowEdit: true, 
  }
  return await this.camera.getPicture(options);
}

async openCamera(){
  const options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    targetHeight: 500,
    targetWidth: 500,
    sourceType: this.camera.PictureSourceType.CAMERA,   

    // saveToPhotoAlbum: true,
    // allowEdit: true, 
  }
  return await this.camera.getPicture(options);
}


async uploadFirebase(){

  const loading = await this.loadingCtrl.create({
    duration: 2000
  });
  await loading.present()

  // perhaps user the uer's id at the start of the file name.
  this.imagePath = 'profile/' + new Date().getTime() + '.jpg';
  this.captureDataUrl = 'data:image/jpeg;base64,';
  this.upload = this.afSG.ref(this.imagePath).putString(this.captureDataUrl, 'DATA_URL')
  .then( async ()=> {
    console.log("upladFirebase() made it to async ()=> { just need to dismiss and create alert")
    //await loading.onDidDismiss();
    await loading.dismiss();
    this.image = 'https://dummyimage.com/300';
    const alert = await this.alert.create({
			header: 'Success',
			message: 'Your image has been upladed',
			buttons: ['OK']
		});
		await alert.present();


  }).catch( async (error) => {
    console.dir(error);
    const alert = await this.alert.create({
			header: 'Failed',
			message: 'Your image was not uploaded upladed' + error,
			buttons: ['OK']
		});
		await alert.present();
  });  
 }
}
