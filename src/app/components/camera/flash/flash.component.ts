import { Component, OnInit } from '@angular/core';
import { CameraService } from '../../../services/camera.service';

@Component({
  selector: 'app-flash',
  templateUrl: './flash.component.html',
  styleUrls: ['./flash.component.scss'],
})
export class FlashComponent implements OnInit {

  isFlashOn = 'off';
  constructor(
    private cameraService : CameraService
  ) { }

  ngOnInit() {}


  toggleFlashMode(){
    
    console.log("Starting isFlashOn value ", this.isFlashOn)
    if(this.isFlashOn == 'off') {      
      this.isFlashOn = 'on';
      console.log("flash is off and it's being set on ? ", this.isFlashOn)
      this.cameraService.changeFlashMode(this.isFlashOn)     
    } else {      
      this.isFlashOn = 'off'; 
      console.log("flash is on is is being set off. Should be false: ", this.isFlashOn)
      this.cameraService.changeFlashMode(this.isFlashOn)          
    }
  } 

}
