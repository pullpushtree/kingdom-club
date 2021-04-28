import { Component, OnInit } from '@angular/core';
import { CameraService } from 'src/app/services/camera.service';

@Component({
  selector: 'app-flip',
  templateUrl: './flip.component.html',
  styleUrls: ['./flip.component.scss'],
})
export class FlipComponent implements OnInit {

  isFlip = false;
  constructor(private cameraService : CameraService) { }

  ngOnInit() {}

  toggleCamera(){
    
    console.log("Starting  isFlip value : ", this.isFlip)
    if(this.isFlip) {
      this.isFlip = false    
      console.log("flip to false - USER front of Camera", this.isFlip)     
      this.cameraService.switchCamera().then( () => this.isFlip = false)  
    } else { 
      //this.isFlip = true
      console.log("flip to true - USE back of CAMERA", this.isFlip)
      this.cameraService.switchCamera().then( () => this.isFlip = true)    
    }   
  }   
}
