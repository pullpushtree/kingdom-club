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































































  // onFileSelected(e){
  //   if(e.target.files){
  //     for(let i=0; i < 6; i++){
  //       let file = e.target.files[0];
  //       let reader = new FileReader();
  //       if (file && file.type.match('image.*')) {
  //         reader.readAsDataURL(file);
  //         reader.readAsDataURL(e.target.files[i]);
  //         reader.onload = (events: any) => {
  //         this.urls.push(events.target.result);
  //         }
  //       } else {
  //         console.log("WILL need to diplay an error")
  //       }
  //     }
  //   }
  //   this.selectedFile = e.target.files[0];
  //   console.log(this.selectedFile)
  // }

  // onChange(file: File) {
  //   if (!file) {
  //     return;
  //   } else {   
      
  //     var mimeType = file[0].type;
  //     if (mimeType.match(/image\/*/) == null) {
  //       //TODO INPUT WARNING ERROR MESSAGE
  //       console.log("Only images are supported.");
  //       return;
  //     }

  //     const reader = new FileReader();
  //     this.file = file;
  //     reader.readAsDataURL(file[0]);

  //     reader.onload = (_event) => {
  //       this.urls.push(_event.target.result)
  //     };
  //   }
  // }

  // preview(files) {
  //   if (files.length === 0)
  //     return;
 
  //   var mimeType = files[0].type;
  //   if (mimeType.match(/image\/*/) == null) {
  //     this.message = "Only images are supported.";
  //     return;
  //   }
 
  //   var reader = new FileReader();
  //   this.imagePath = files;
  //   reader.readAsDataURL(files[0]); 
  //   reader.onload = (_event) => { 
  //     this.imgURL0 = reader.result; 
  //   }
  // }



  


  // takePicture(){   

  //   const options: CameraOptions = {
  //     quality: 100,
  //     sourceType: this.camera.PictureSourceType.CAMERA,
  //     //sourceType:this.camera.PictureSourceType.PHOTOLIBRARY,
  //     //destinationType: this.camera.DestinationType.DATA_URL,
  //     destinationType: this.camera.DestinationType.FILE_URI,
  //     saveToPhotoAlbum: false,
  //     allowEdit: true, 
  //     targetHeight: 500,
  //     targetWidth: 500  
  //   }


  //   this.camera.getPicture(options).then((imageData)=> {
  //     // imageData is either a base64 encoded string or a file URI
  //     // If it's base64:
  //     this.filepath.resoveNativePath(imageUri).then((nativepath) => {
  //       this.photos.push(nativepath);
  //     })
  //     this.base64Image = 'data:image/jpeg;base64,' + imageData;
  //     this.imgURL0 = imageData;
  //   }).catch(error => {
  //     console.dir(error)
  //   })

  // }


  // selectPicture(){    
  //   this.camera.getPicture({
  //     sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
  //     destinationType: this.camera.DestinationType.FILE_URI
  //   }).then((imageData) => {
  //     this.imgURL0 = 'data:image/jpeg; base64,' + imageData;
  //   }).catch(error => {
  //     console.dir(error)
  //   })
  // }


  // // uploadImage(){
  // //   let url = ''; 
  // //   let postData = new FormData();
  // //   postData.append('file', this.base64Image);
  // //   let data: Observable<any> = this.http.post(url, postData);
  // //   data.subscribe((result)=> {
  // //     console.log(result);
  // //   })
  // // }


  // onUpload(){
    
  //   // if(this.imgURL0 > 0){
  //   //   this.router.navigate(['/home/chats']);
  //   // } else {
  //   //   return null
  //   // }
  // }



  // // onSelectFile(event) { // called each time file input changes
  // //   if (event.target.files && event.target.files[0]) {
  // //     var reader = new FileReader();

  // //     reader.readAsDataURL(event.target.files[0]); // read file as data url

  // //     reader.onload = (event) => { // called once readAsDataURL is completed
  // //       this.url = event.target.result;
  // //     }
  // //   }
  // // }






















































































  // getGallery(){
  //   this.camera.getPicture()
  //   .then((imageData) => {
  //     this.imgURL2 = imageData;
  //     this.selectedPhoto = this.dataURLtoBlob('data:image/jpeg; base64, '+ imageData)
  //     this.upload();
  //   }, (error)=> {
  //     console.log('error', error)
  //   }
  //   ).catch(error => {
  //     console.dir(error)
  //   });
  // }



  // getCamera2(){

  // }





  // getCamera(){
  //   const options: CameraOptions = {
  //     quality: 100,
  //     destinationType: this.camera.DestinationType.DATA_URL,
  //     sourceType:this.camera.PictureSourceType.PHOTOLIBRARY,
  //     saveToPhotoAlbum: false,
  //     allowEdit: true, 
  //     targetHeight: 500,
  //     targetWidth: 500 
  //   }

  //   this.camera.getPicture({
  //     sourceType: this.camera.PictureSourceType.CAMERA,
  //     destinationType: this.camera.DestinationType.FILE_URI
  //   }).then((res)=> {
  //     this.imgURL2 = res;
  //   }).catch(error => {
  //     console.dir(error)
  //   })


    // this.camera.getPicture(options)
    // .then((imageData) => {
    //   this.imgURL2 = imageData;
    //   this.selectedPhoto = this.dataURLtoBlob('data:image/jpeg; base64, '+ imageData)
    //   this.upload();
    // }, (error)=> {
    //   console.log('error', error)
    // }
    // ).catch(error => {
    //   console.dir(error)
    // });

 // }


 
  


  

  // takeImage(){
  //   const options: CameraOptions = {
  //     quality: 100,
  //     destinationType: this.camera.DestinationType.DATA_URL,
  //     sourceType:this.camera.PictureSourceType.PHOTOLIBRARY,
  //     saveToPhotoAlbum: false,
  //     allowEdit: true, 
  //     targetHeight: 500,
  //     targetWidth: 500 
  //   }
  //   this.camera.getPicture(options)
  //   .then((imageData) => {      
  //     this.selectedPhoto = this.dataURLtoBlob('data:image/jpeg; base64, '+ imageData)
  //     this.upload();
  //   }, (error)=> {
  //     console.log('error', error)
  //   }
  //   ).catch(error => {
  //     console.dir(error)
  //   });
  // }

  // dataURLtoBlob(dataURL){
  //   let binary = atob(dataURL.split(',')[1]);
  //   let array =[];
  //   for(let i=0; i <binary.length; i++){
  //     array.push(binary.charCodeAt(i));
  //   }
  //   return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});    
  // };

  // async upload(){
  //   SetProfileImagesPage.loading = await this.loadingCtrl.create({
  //     message: 'uploading...'
  //   }); 
  //   await SetProfileImagesPage.loading.present();

    // if(this.selectedPhoto){
    //   var uploadtask = this.afs.storage().ref().child('myImage.png')
    //   .put(this.selectedPhoto);
    //   uploadtask.then(this.onSuccess, this.onError);
    // }

    // onSuccess = snapshot => {
    //   snapshot.ref.getDownloadURL().then((downloadURL) => {
    //     SetProfileImagesPage.URL = downloadURL; 
    //     SetProfileImagesPage.loading.dismiss();
    //   });
    //   this.imgURL = SetProfileImagesPage.URL
    // };

    // onError = error => {
    //   console.dir('error', error)
    // };

  //}

}
