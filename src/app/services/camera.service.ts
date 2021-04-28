import { Injectable } from '@angular/core';
import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions, CameraPreviewDimensions } from '@ionic-native/camera-preview/ngx';
import { stat } from 'node:fs';

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  
  IMAGE_PATH: any;  
  setZoom = 1;
  flashMode = 'off';
  isToBack = false;
  videoRecData: any;

  constructor(private cameraPreview: CameraPreview) { }

  async takePicture() {
    return await this.cameraPreview.takePicture({      
      quality: 85      
    }).then((imageData) => {
      return 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      console.log(err);
      alert(" takePicture() Failed : " + err);
      this.IMAGE_PATH = 'assets/img/test.jpg';
    });
  }

  async takeSnapshot(){
    return await this.cameraPreview.takeSnapshot({      
      quality: 85      
    })
    .then((imageData) => {
      return  'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      console.log(err);
      alert(JSON.stringify(err));      
    });
  }
  
  async startCameraBack() {    
      const cameraPreviewOpts: CameraPreviewOptions = {
      x: 200,
      y: 200,
      width: (window.screen.width / 2 ),
      height: (window.screen.height / 2 ),
      camera: this.cameraPreview.CAMERA_DIRECTION.BACK,      
      tapFocus: true,
      previewDrag: true,
      toBack: false,
      alpha: 1
    }

    this.isToBack = false;    
    return await this.cameraPreview.startCamera( cameraPreviewOpts)
    .then((val) => { 
      console.log('START BACK : ' + val)      
      //this.IMAGE_PATH = 'data:image/jpeg;base64,' + val;     
    })
    .catch(err => {
      console.error('couldnt access BACK camera : ' + err)      
      this.cameraPreview.stopCamera();
      alert(err);
    });
  }
  
  async startCameraFront() {
    const cameraPreviewOpts: CameraPreviewOptions = {
      x: 200,
      y: 200,
      width: (window.screen.width / 2 ),
      height: (window.screen.height / 2 ),
      camera: this.cameraPreview.CAMERA_DIRECTION.FRONT,
      tapFocus: true,      
      previewDrag: true,
      toBack: false,
      alpha: 1      
    }

    this.isToBack = false;
      
    return await this.cameraPreview.startCamera(cameraPreviewOpts)
    .then((val) => {
      console.log('cameraService.ts START FRONT : ' + val)
    })
    .catch(err => {
      console.error('cameraService.ts couldnt access FRONT camera : ' + err)        
      this.cameraPreview.stopCamera();
      alert(JSON.stringify(err));
    });   
  }

  async startRecordVideo(){
    const videoOptions = { 
      cameraDirection: this.cameraPreview.CAMERA_DIRECTION.BACK,
      width: (window.screen.width / 2),
      height: (window.screen.height / 2),
      quality: 60,
      withFlash: this.flashMode !== 'off'
    }
    
    return await this.cameraPreview.startRecordVideo(videoOptions)
    .then((videoData) => {        
      console.log('START REC! => videoData : ' + videoData);
      //this.IMAGE_PATH = 'data:image/jpeg;base64,' + imageData;      
    }) 
    .catch(err => {
      console.error('Something went wrong while recording your video :' + err);     
      this.cameraPreview.stopCamera();
      alert(err);
    });
  }

  async stopRecordVideo(){    
    return await this.cameraPreview.stopRecordVideo()
    .then(videoRecData => {
       this.videoRecData = videoRecData
       console.log("camera.service.ts  then => this.videoRecData : ", this.videoRecData);
    });
  }

  async stopCamera() {
    return await this.cameraPreview.stopCamera()
    .then((cameraData) => {
      console.log('camera STOP :' + cameraData)
    });
  }

  async switchCamera() {
    return await this.cameraPreview.switchCamera();
  }

  async show() {
    return await this.cameraPreview.show();
  }

  async hide() {
    return await this.cameraPreview.hide();
  }

  async changeFlashMode(status: string){
    console.log("status being passed in changeFlashMode : ", status)

    if(status == 'on'){
      console.log("flash is on,setting it to off ")
      this.cameraPreview.FLASH_MODE.OFF;
      // this.cameraPreview.setFlashMode('off');
    } else {
      console.log("flash is off, setting it to on ")
      this.cameraPreview.FLASH_MODE.ON;
      //await this.cameraPreview.setFlashMode('on');
    }

    await this.cameraPreview.setFlashMode(status)
    .then( (results) => {
      console.log("camera.service.ts changeFlashMode => results : ", results);
    });
    console.log("status being passed in changeFlashMode : ", status);
  }
}
