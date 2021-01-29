import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { LoadingController, AlertController } from '@ionic/angular';
import { AuthConstants } from '../../config/auth-constant'

@Component({
  selector: 'app-set-profile-images',
  templateUrl: './set-profile-images.page.html',
  styleUrls: ['./set-profile-images.page.scss'],
})
export class SetProfileImagesPage implements OnInit {

  image = 'https://dummyimage.com/300';
  imagePath: string;
  imageUpload: any;

  constructor(
    public camera: Camera, 
    private loadingCtrl: LoadingController,
    private router: Router,
    private afs: AngularFirestore,
    private afStore: AngularFireStorage,
    private alert: AlertController,  
    ) { }
    
  ngOnInit() {
  }


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
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY    
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
    correctOrientation: true,
    cameraDirection: 0
  }
  return await this.camera.getPicture(options);
}


async uploadFirebase(){

  const currentUser = JSON.parse(localStorage.getItem(AuthConstants.AUTH)); 
  const loading = await this.loadingCtrl.create();
  await loading.present();
  
  this.imagePath = new Date().getTime() + '.jpg';

  //save image to storage
  this.imageUpload = await this.afStore.ref(this.imagePath)
  .putString(this.image, 'data_url')
  .then(res => {
    const imageFile = res.task.snapshot.ref.getDownloadURL()
    .then(downloadableURL => {
      //update user collection 
      this.afs.collection('users').doc(currentUser.user.uid)
      .update( { photoURL: downloadableURL });
    })
  }).finally(async () => {
  
    await loading.onDidDismiss();
    const alert = await this.alert.create({
      header: 'Success',
      message: 'Your image was saved',
      buttons: ['OK']
    });
    await alert.present()
    .then(()=>{ 
      this.router.navigate(['home/chats'])
    });
  })
  .catch(error => {
    console.dir(error);
    const alert = this.alert.create({
			header: 'Error',
			message: 'Image was not saved <br/>' + error,
			buttons: ['OK']
		});
  });
  }
}
