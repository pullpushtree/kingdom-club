import { Component, Input, OnInit} from '@angular/core';
import { CameraService } from '../../services/camera.service';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.page.html',
  styleUrls: ['./camera.page.scss'],
})
export class CameraPage implements OnInit {
  @Input('isFlashOn') isFlashOn : Boolean
  @Input('isBackCamera') isBackCamera : Boolean
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

  cropPicture(){
    console.log("Camera.ts cropPicture() got hit",)  
  }

  clearPicture(){
    this.IMAGE_PATH = null
  }

  ionViewWillLeave(){
    this.cameraService.hide();
    this.cameraService.stopCamera();
  }
}