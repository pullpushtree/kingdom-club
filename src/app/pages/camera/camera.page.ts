import { Component, Input, OnInit} from '@angular/core';
import { CameraService } from '../../services/camera.service';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.page.html',
  styleUrls: ['./camera.page.scss'],
})
export class CameraPage implements OnInit {
  isBackCamera : Boolean
  IMAGE_PATH: any;
  
  constructor(
    private cameraService : CameraService
  ) { }

  ngOnInit() {   
    document.body.style.backgroundColor = "transparent !important"
   }

   ionViewWillEnter(){
    this.cameraService.startCameraFront()    
    this.IMAGE_PATH = '';
   } 

  takePicture(){    
    this.IMAGE_PATH = this.cameraService.takePicture()
    .then((imageData) => {      
      this.IMAGE_PATH = imageData
    });     
  }

  savePicture(){
    this.cameraService.savePicture(this.IMAGE_PATH)
  }

  cropPicture(){
    console.log("Camera.ts cropPicture() got hit",)  
  }

  clearPicture(){
    this.IMAGE_PATH = ''
  }

  ionViewWillLeave(){
    this.cameraService.hide();
    this.cameraService.stopCamera();
  }
}