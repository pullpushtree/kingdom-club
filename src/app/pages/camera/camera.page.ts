import { Component, OnInit} from '@angular/core';
import { CameraService } from '../../services/camera.service'; 

@Component({
  selector: 'app-camera',
  templateUrl: './camera.page.html',
  styleUrls: ['./camera.page.scss'],
})
export class CameraPage implements OnInit {

  IMAGE_PATH: any;
  
  constructor(
    private cameraService : CameraService
  ) { }

  ngOnInit() {   
   }

   ionViewWillEnter(){
    this.cameraService.startCameraFront()    
   } 

  takePicture(){    
    this.IMAGE_PATH = this.cameraService.takePicture()
    .then( (results) => {
      this.IMAGE_PATH = results      
    });     
  }

  ionViewWillLeave(){
    this.cameraService.hide();
    this.cameraService.stopCamera();
  }
}