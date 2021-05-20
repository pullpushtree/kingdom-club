import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { CameraPreview, CameraPreviewOptions } from '@ionic-native/camera-preview/ngx';
import { ToastController } from '@ionic/angular';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class CameraService {
  
  currentUser: any;
  IMAGE_PATH: any;  
  setZoom = 1;
  imgURL: any;
  picData: string;
  

  constructor(private cameraPreview: CameraPreview,
    private toastr: ToastController, 
    private afs: AngularFirestore,
    private afauthSrv: AuthService,
    private afStore: AngularFireStorage
  ) { 
    this.afauthSrv.user$.subscribe((user) => {
      this.currentUser = JSON.stringify(user); 
    })

  }

  async takePicture() {
    return await this.cameraPreview.takePicture({  
      width: 1280,
      height: 1280,
      quality: 85      
    })
    .then((rawImageData) => {   
    this.savePreviewPicture(rawImageData)
    .catch(err => console.error("SERVICE svePreviewPicture() error : ", err))
    const tempBase64 = 'data:image/jpeg;base64,' + rawImageData;
      return tempBase64
    }, (err) => {
      console.error(err);
      this.toast('Take picture Error', 'danger');      
    });
  }

  async savePreviewPicture(rawImageData){
    
    const curUser = JSON.parse(this.currentUser)
    const name = Math.floor(Date.now() / 1000)
    
    const imagePath = `${curUser.uid}/scrapPics2/${name}.jpg`; 
    this.picData = "data:image/jpg;base64," + rawImageData;
    
    const picRef = this.afStore.ref(imagePath)    
    picRef.putString(this.picData, 'data_url', {contentType: 'image/jpeg'})
    .then((snapshot) => {
      const dwnldURL = snapshot.ref.getDownloadURL();
        dwnldURL.then(url => {
          this.imgURL = url;   
          this.afs.collection(`scrapbook2/${curUser.uid}/album`)          
          .add({
            uidd : this.afs.createId(),
            photoURL : this.imgURL,            
            fileName : imagePath,
            dateStamp : Date.now()
          })
          .then((docRef) => {
            console.log("Document written with ID GOLD : ", docRef.id);
            this.afs.doc(`scrapbook2/${curUser.uid}/album/${docRef.id}`)
            .update({ uid : docRef.id})
            .catch(function(error) {
              console.error("Error adding document UID: ", error);
          });
          })
          .catch(function(error) {
              console.error("Error adding document: ", error);
          });
        })
        .catch(err => {
          this.toast("Picture Save Pic Preview Failed", "danger")
          console.error(err)
        })
    })
  }

  async savePicture(rawImageData){
    
    const curUser = JSON.parse(this.currentUser)
    const name = Math.floor(Date.now() / 1000)
    console.log("user Id savePicture() ", curUser.uid)
    const imagePath = `${curUser.uid}/pictures/${name}.jpg`; 
        
    const picRef = this.afStore.ref(imagePath)    
    picRef.putString(rawImageData, 'data_url', {contentType: 'image/jpeg'})
    .then((snapshot) => {
      const dwnldURL = snapshot.ref.getDownloadURL();
      dwnldURL.then(res => {
        this.imgURL = res;   
        this.afs.collection(`pictures/${curUser.uid}/album`)          
        .add({
          uid : this.afs.createId(),
          photoURL : this.imgURL,            
          fileName : imagePath,
          dateStamp : Date.now()
        })
        .catch(err => {
          console.error("Error occured while saving picture", err)
        })
      })
      .catch(err => {
        console.error("Error occured getting the ref picture url ", err)
      })      
    })
    .catch(err => {
      this.toast("Picture Save Failed", "danger")
      console.error(err)
    })
  }
  
  async startCameraBack() {    
      const cameraPreviewOpts: CameraPreviewOptions = {
      x: 0,
      y: 0,
      width: window.screen.width,
      height: window.screen.height,
      camera: this.cameraPreview.CAMERA_DIRECTION.BACK,
      tapPhoto: false,
      previewDrag: false,
      toBack: true,
      alpha: 1,
      disableExifHeaderStripping: false
    }

    return await this.cameraPreview.startCamera(cameraPreviewOpts)
    .then((imageData) => {      
      return 'data:image/jpeg;base64,' + imageData;     
    })
    .catch(err => {
      console.error('couldnt access BACK camera : ' + err)      
      this.cameraPreview.stopCamera();
      this.toast('Back Camera Start error ', 'danger');
      //alert(err);
    });
  }
  
  async startCameraFront() {
    const cameraPreviewOpts: CameraPreviewOptions = {
      x: 0,
      y: 0,
      width: window.screen.width,
      height: window.screen.height,
      camera: this.cameraPreview.CAMERA_DIRECTION.FRONT,
      tapPhoto: false,
      previewDrag: false,
      toBack: true,
      alpha: 1,
      disableExifHeaderStripping: false
    }
      
    return await this.cameraPreview.startCamera(cameraPreviewOpts)
    .catch(err => {
      console.error('cameraService.ts couldnt access FRONT camera : ' + err)        
      this.cameraPreview.stopCamera(); 
      this.toast('Front Camera Start erro', 'danger');
    });   
  }

  async stopCamera() {
    return await this.cameraPreview.stopCamera()
    .then((cameraData) => {
      console.log('camera STOP :' + cameraData)
    });
  }

  async show() {
    return await this.cameraPreview.show();
  }

  async hide() {
    return await this.cameraPreview.hide();
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

  async changeFlashMode(status: string){
    if(status == 'on'){
      await this.cameraPreview.setFlashMode('on')
      .catch((error) => {
        this.toast('FLASH ON - not supported', 'danger');      
        console.error("SERVICE error =>  ", error)
      });
    } else {
      this.cameraPreview.setFlashMode('off')
    }    
  }
}
